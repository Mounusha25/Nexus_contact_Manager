import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get today's follow-ups for a user
export const getFollowUpsForToday = query({
  args: {},
  handler: async (ctx) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return [];

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "pending")
      )
      .filter((q) => q.lte(q.field("dueAt"), today.getTime()))
      .collect();

    // Get contact details for each follow-up
    const followUpsWithContacts = await Promise.all(
      followUps.map(async (followUp) => {
        const contact = await ctx.db.get(followUp.contactId);
        return {
          ...followUp,
          contact,
        };
      })
    );

    // Sort by due date
    followUpsWithContacts.sort((a, b) => a.dueAt - b.dueAt);

    return followUpsWithContacts;
  },
});

// Get all follow-ups for a contact
export const getFollowUpsForContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return [];

    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .order("desc")
      .collect();

    return followUps;
  },
});

// Create a follow-up manually
export const createFollowUp = mutation({
  args: {
    contactId: v.id("contacts"),
    reason: v.string(),
    dueAt: v.number(),
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

    const followUpId = await ctx.db.insert("followUps", {
      contactId: args.contactId,
      userId: user._id,
      reason: args.reason,
      dueAt: args.dueAt,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return followUpId;
  },
});

// Mark follow-up as done
export const markFollowUpDone = mutation({
  args: { id: v.id("followUps") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const followUp = await ctx.db.get(args.id);
    if (!followUp) throw new Error("Follow-up not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || followUp.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: "done",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Skip a follow-up
export const skipFollowUp = mutation({
  args: { id: v.id("followUps") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const followUp = await ctx.db.get(args.id);
    if (!followUp) throw new Error("Follow-up not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || followUp.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: "skipped",
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Compute smart follow-ups for all contacts (scheduled job)
export const computeSmartFollowUps = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const fortyFiveDaysAgo = now - 45 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    for (const contact of contacts) {
      // Skip archived contacts
      if (contact.lifecycleStage === "archived") continue;

      // Check if there's already a pending follow-up
      const existingFollowUp = await ctx.db
        .query("followUps")
        .withIndex("by_contact", (q) => q.eq("contactId", contact._id))
        .filter((q) => q.eq(q.field("status"), "pending"))
        .first();

      if (existingFollowUp) continue; // Already has a follow-up

      let shouldCreateFollowUp = false;
      let reason = "";
      let urgency = 0;

      // No interaction in 45+ days for active contacts
      if (
        contact.lifecycleStage === "active" &&
        (!contact.lastInteractionAt || contact.lastInteractionAt < fortyFiveDaysAgo)
      ) {
        shouldCreateFollowUp = true;
        const daysSince = contact.lastInteractionAt
          ? Math.floor((now - contact.lastInteractionAt) / (24 * 60 * 60 * 1000))
          : 999;
        reason = `No contact in ${daysSince} days`;
        urgency = 2;
      }

      // No interaction in 30+ days for recruiters/clients
      if (
        (contact.autoType === "recruiter" || contact.autoType === "client") &&
        (!contact.lastInteractionAt || contact.lastInteractionAt < thirtyDaysAgo)
      ) {
        shouldCreateFollowUp = true;
        const daysSince = contact.lastInteractionAt
          ? Math.floor((now - contact.lastInteractionAt) / (24 * 60 * 60 * 1000))
          : 999;
        reason = `${contact.autoType === "recruiter" ? "Recruiter" : "Client"} - no contact in ${daysSince} days`;
        urgency = 3;
      }

      // High score but falling (check score trend)
      if (contact.relationshipScore >= 70) {
        // Would need historical scores to detect "falling"
        // For now, check if score is high but no recent interaction
        if (!contact.lastInteractionAt || contact.lastInteractionAt < thirtyDaysAgo) {
          shouldCreateFollowUp = true;
          reason = `High score (${contact.relationshipScore}) but no recent contact`;
          urgency = 2;
        }
      }

      // Dormant contacts worth reviving
      if (
        contact.lifecycleStage === "dormant" &&
        contact.relationshipScore >= 50
      ) {
        shouldCreateFollowUp = true;
        reason = `Valuable dormant contact (score: ${contact.relationshipScore})`;
        urgency = 1;
      }

      if (shouldCreateFollowUp) {
        // Set due date based on urgency
        const daysUntilDue = urgency === 3 ? 1 : urgency === 2 ? 3 : 7;
        const dueAt = now + daysUntilDue * 24 * 60 * 60 * 1000;

        await ctx.db.insert("followUps", {
          contactId: contact._id,
          userId: args.userId,
          reason,
          dueAt,
          status: "pending",
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return { success: true };
  },
});
