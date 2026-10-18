import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { determineLifecycleStage } from "../lib/crm/contact-intelligence";
import { internal } from "./_generated/api";

// Update lifecycle stage for a contact based on interaction patterns
export const updateLifecycleStage = internalMutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) return;

    const now = Date.now();
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    // Get recent interactions
    const recentInteractions = await ctx.db
      .query("interactions")
      .withIndex("by_contact_timestamp", (q) => q.eq("contactId", args.contactId))
      .filter((q) => q.gte(q.field("timestamp"), sixtyDaysAgo))
      .collect();

    const { stage: newStage, explanation } = determineLifecycleStage({
      currentStage: contact.lifecycleStage,
      lastInteractionAt: contact.lastInteractionAt,
      recentInteractionCount: recentInteractions.length,
      relationshipScore: contact.relationshipScore,
      now,
    });

    // Only update if stage changed
    if (newStage !== contact.lifecycleStage) {
      await ctx.db.patch(args.contactId, {
        lifecycleStage: newStage,
        updatedAt: now,
      });
    }

    return { stage: newStage, explanation };
  },
});

// Batch update lifecycle stages for all contacts of a user
export const updateAllLifecycleStages = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const contact of contacts) {
      await ctx.scheduler.runAfter(0, internal.lifecycle.updateLifecycleStage, {
        contactId: contact._id,
      });
    }

    return { processed: contacts.length };
  },
});
