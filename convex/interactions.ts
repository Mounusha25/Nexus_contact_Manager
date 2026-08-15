import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Log a new interaction
export const logInteraction = mutation({
  args: {
    contactId: v.id("contacts"),
    type: v.union(
      v.literal("email"),
      v.literal("call"),
      v.literal("meeting"),
      v.literal("dm"),
      v.literal("other")
    ),
    channel: v.optional(v.string()),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    content: v.optional(v.string()),
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const contact = await ctx.db.get(args.contactId);
    if (!contact || contact.userId !== user._id) {
      throw new Error("Contact not found");
    }

    const interactionId = await ctx.db.insert("interactions", {
      contactId: args.contactId,
      userId: user._id,
      type: args.type,
      channel: args.channel,
      direction: args.direction,
      content: args.content,
      timestamp: args.timestamp || Date.now(),
      createdAt: Date.now(),
    });

    // Update contact's last interaction time
    await ctx.db.patch(args.contactId, {
      lastInteractionAt: args.timestamp || Date.now(),
      updatedAt: Date.now(),
    });

    // Recompute relationship score
    await ctx.scheduler.runAfter(0, "scoring:computeRelationshipScore", {
      contactId: args.contactId,
    });

    // Update lifecycle stage
    await ctx.scheduler.runAfter(0, "lifecycle:updateLifecycleStage", {
      contactId: args.contactId,
    });

    return interactionId;
  },
});

// Get interactions for a contact
export const getInteractions = query({
  args: {
    contactId: v.id("contacts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return [];

    const contact = await ctx.db.get(args.contactId);
    if (!contact) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || contact.userId !== user._id) return [];

    let interactions = await ctx.db
      .query("interactions")
      .withIndex("by_contact_timestamp", (q) => q.eq("contactId", args.contactId))
      .order("desc")
      .collect();

    if (args.limit) {
      interactions = interactions.slice(0, args.limit);
    }

    return interactions;
  },
});

// Get recent interactions for dashboard
export const getRecentInteractions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return [];

    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_user_timestamp", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 10);

    // Get contact details for each interaction
    const interactionsWithContacts = await Promise.all(
      interactions.map(async (interaction) => {
        const contact = await ctx.db.get(interaction.contactId);
        return {
          ...interaction,
          contact,
        };
      })
    );

    return interactionsWithContacts;
  },
});
