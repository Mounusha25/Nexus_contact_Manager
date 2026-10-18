import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { classifyContact } from "../lib/crm/contact-intelligence";

/**
 * Contact Management API
 * Handles CRUD operations for contacts with user authentication
 */

// Create a new contact
export const createContact = mutation({
  args: {
    name: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    emails: v.array(v.string()),
    phones: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    title: v.optional(v.string()),
    location: v.optional(v.string()),
    industry: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const contactId = await ctx.db.insert("contacts", {
      userId: user._id,
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
      emails: args.emails,
      phones: args.phones || [],
      company: args.company,
      title: args.title,
      location: args.location,
      industry: args.industry,
      tags: args.tags || [],
      relationshipScore: 0,
      lifecycleStage: "new",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return contactId;
  },
});

// Get all contacts for a user
export const getContacts = query({
  args: {
    search: v.optional(v.string()),
    lifecycleStage: v.optional(v.string()),
    industry: v.optional(v.string()),
    autoType: v.optional(v.string()),
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

    let contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Apply filters
    if (args.lifecycleStage) {
      contacts = contacts.filter(c => c.lifecycleStage === args.lifecycleStage);
    }
    if (args.industry) {
      contacts = contacts.filter(c => c.industry === args.industry);
    }
    if (args.autoType) {
      contacts = contacts.filter(c => c.autoType === args.autoType);
    }
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      contacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.company?.toLowerCase().includes(searchLower) ||
        c.emails.some(e => e.toLowerCase().includes(searchLower))
      );
    }

    // Sort by relationship score descending
    contacts.sort((a, b) => b.relationshipScore - a.relationshipScore);

    if (args.limit) {
      contacts = contacts.slice(0, args.limit);
    }

    return contacts;
  },
});

// Get a single contact by ID
export const getContact = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return null;

    const contact = await ctx.db.get(args.id);
    if (!contact) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || contact.userId !== user._id) return null;

    return contact;
  },
});

// Update a contact
export const updateContact = mutation({
  args: {
    id: v.id("contacts"),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    emails: v.optional(v.array(v.string())),
    phones: v.optional(v.array(v.string())),
    company: v.optional(v.string()),
    title: v.optional(v.string()),
    location: v.optional(v.string()),
    industry: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    lifecycleStage: v.optional(v.union(
      v.literal("new"),
      v.literal("active"),
      v.literal("dormant"),
      v.literal("archived")
    )),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const contact = await ctx.db.get(args.id);
    if (!contact) throw new Error("Contact not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || contact.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete a contact
export const deleteContact = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const contact = await ctx.db.get(args.id);
    if (!contact) throw new Error("Contact not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || contact.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Delete all related data
    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_contact", (q) => q.eq("contactId", args.id))
      .collect();
    for (const interaction of interactions) {
      await ctx.db.delete(interaction._id);
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_contact", (q) => q.eq("contactId", args.id))
      .collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_contact", (q) => q.eq("contactId", args.id))
      .collect();
    for (const followUp of followUps) {
      await ctx.db.delete(followUp._id);
    }

    const primaryCandidates = await ctx.db
      .query("dedupeCandidates")
      .withIndex("by_primary", (q) => q.eq("primaryContactId", args.id))
      .collect();
    const duplicateCandidates = await ctx.db
      .query("dedupeCandidates")
      .withIndex("by_duplicate", (q) => q.eq("duplicateContactId", args.id))
      .collect();
    const candidateIds = new Set([
      ...primaryCandidates.map((candidate) => candidate._id),
      ...duplicateCandidates.map((candidate) => candidate._id),
    ]);
    for (const candidateId of candidateIds) {
      await ctx.db.delete(candidateId);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Auto-tag a contact
export const autoTag = mutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();
    if (!user || contact.userId !== user._id) throw new Error("Unauthorized");

    const autoType = classifyContact(contact.title, contact.company);
    const newTags: string[] = [...contact.tags];
    if (autoType !== "other" && !newTags.includes(autoType)) newTags.push(autoType);

    await ctx.db.patch(args.contactId, {
      autoType,
      tags: newTags,
      updatedAt: Date.now(),
    });
  },
});
