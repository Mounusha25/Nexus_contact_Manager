import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { calculateDuplicateScore, mergeUnique } from "../lib/crm/contact-intelligence";
import { internal } from "./_generated/api";

// Detect duplicates for a contact
export const detectDuplicates = internalMutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) return;

    // Get all contacts for the same user
    const allContacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", contact.userId))
      .collect();

    for (const otherContact of allContacts) {
      if (otherContact._id === contact._id) continue;

      const { confidence } = calculateDuplicateScore(contact, otherContact);

      // Only create candidate if confidence > 0.5
      if (confidence > 0.5) {
        // Check if this pair already exists
        const existing = await ctx.db
          .query("dedupeCandidates")
          .withIndex("by_primary", (q) => q.eq("primaryContactId", contact._id))
          .filter((q) => q.eq(q.field("duplicateContactId"), otherContact._id))
          .first();

        const existingReverse = await ctx.db
          .query("dedupeCandidates")
          .withIndex("by_primary", (q) => q.eq("primaryContactId", otherContact._id))
          .filter((q) => q.eq(q.field("duplicateContactId"), contact._id))
          .first();

        if (!existing && !existingReverse) {
          await ctx.db.insert("dedupeCandidates", {
            userId: contact.userId,
            primaryContactId: contact._id,
            duplicateContactId: otherContact._id,
            confidence,
            status: "suggested",
            createdAt: Date.now(),
          });
        }
      }
    }

    return { success: true };
  },
});

// Get suggested duplicates for user
export const getSuggestedDuplicates = query({
  args: {},
  handler: async (ctx) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return [];

    const candidates = await ctx.db
      .query("dedupeCandidates")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "suggested")
      )
      .collect();

    // Get contact details for each candidate
    const candidatesWithContacts = await Promise.all(
      candidates.map(async (candidate) => {
        const primary = await ctx.db.get(candidate.primaryContactId);
        const duplicate = await ctx.db.get(candidate.duplicateContactId);
        return {
          ...candidate,
          primary,
          duplicate,
        };
      })
    );

    // Sort by confidence descending
    candidatesWithContacts.sort((a, b) => b.confidence - a.confidence);

    return candidatesWithContacts;
  },
});

// Merge two contacts
export const mergeContacts = mutation({
  args: {
    primaryId: v.id("contacts"),
    duplicateId: v.id("contacts"),
    fieldPreferences: v.object({
      name: v.optional(v.string()),
      emails: v.optional(v.array(v.string())),
      phones: v.optional(v.array(v.string())),
      company: v.optional(v.string()),
      title: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const primary = await ctx.db.get(args.primaryId);
    const duplicate = await ctx.db.get(args.duplicateId);

    if (!primary || !duplicate) throw new Error("Contact not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || primary.userId !== user._id || duplicate.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Merge data
    const mergedEmails = mergeUnique(primary.emails, duplicate.emails, args.fieldPreferences.emails || []);
    const mergedPhones = mergeUnique(primary.phones, duplicate.phones, args.fieldPreferences.phones || []);
    const mergedTags = mergeUnique(primary.tags, duplicate.tags, args.fieldPreferences.tags || []);

    await ctx.db.patch(args.primaryId, {
      name: args.fieldPreferences.name || primary.name,
      emails: mergedEmails,
      phones: mergedPhones,
      company: args.fieldPreferences.company || primary.company,
      title: args.fieldPreferences.title || primary.title,
      tags: mergedTags,
      updatedAt: Date.now(),
    });

    // Move interactions from duplicate to primary
    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_contact", (q) => q.eq("contactId", args.duplicateId))
      .collect();
    for (const interaction of interactions) {
      await ctx.db.patch(interaction._id, { contactId: args.primaryId });
    }

    // Move notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_contact", (q) => q.eq("contactId", args.duplicateId))
      .collect();
    for (const note of notes) {
      await ctx.db.patch(note._id, { contactId: args.primaryId });
    }

    // Move follow-ups
    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_contact", (q) => q.eq("contactId", args.duplicateId))
      .collect();
    for (const followUp of followUps) {
      await ctx.db.patch(followUp._id, { contactId: args.primaryId });
    }

    // Delete duplicate contact
    await ctx.db.delete(args.duplicateId);

    // Remove every suggestion that points at the deleted duplicate.
    const primaryCandidates = await ctx.db
      .query("dedupeCandidates")
      .withIndex("by_primary", (q) => q.eq("primaryContactId", args.duplicateId))
      .collect();
    const duplicateCandidates = await ctx.db
      .query("dedupeCandidates")
      .withIndex("by_duplicate", (q) => q.eq("duplicateContactId", args.duplicateId))
      .collect();
    const candidateIds = new Set([
      ...primaryCandidates.map((candidate) => candidate._id),
      ...duplicateCandidates.map((candidate) => candidate._id),
    ]);
    for (const candidateId of candidateIds) {
      await ctx.db.delete(candidateId);
    }

    // Recompute relationship score for merged contact
    await ctx.scheduler.runAfter(0, internal.scoring.computeRelationshipScore, {
      contactId: args.primaryId,
    });

    return args.primaryId;
  },
});

// Ignore a duplicate suggestion
export const ignoreDuplicate = mutation({
  args: { candidateId: v.id("dedupeCandidates") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) throw new Error("Not authenticated");

    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate) throw new Error("Candidate not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user || candidate.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.candidateId, { status: "ignored" });
    return args.candidateId;
  },
});
