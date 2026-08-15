import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Update lifecycle stage for a contact based on interaction patterns
export const updateLifecycleStage = internalMutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) return;

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    // Get recent interactions
    const recentInteractions = await ctx.db
      .query("interactions")
      .withIndex("by_contact_timestamp", (q) => q.eq("contactId", args.contactId))
      .filter((q) => q.gte(q.field("timestamp"), sixtyDaysAgo))
      .collect();

    let newStage: "new" | "active" | "dormant" | "archived" = contact.lifecycleStage;
    let explanation = "";

    // Determine stage
    if (!contact.lastInteractionAt && recentInteractions.length === 0) {
      // No interactions ever
      newStage = "new";
      explanation = "New contact with no interactions";
    } else if (contact.lastInteractionAt && contact.lastInteractionAt < oneYearAgo) {
      // No interaction in over a year
      newStage = "archived";
      explanation = "No contact in over 1 year";
    } else if (contact.lastInteractionAt && contact.lastInteractionAt < sixtyDaysAgo) {
      // No interaction in 60+ days
      newStage = "dormant";
      const daysSince = Math.floor((now - contact.lastInteractionAt) / (24 * 60 * 60 * 1000));
      explanation = `No contact in ${daysSince} days`;
    } else if (recentInteractions.length >= 2) {
      // 2+ interactions in last 60 days
      newStage = "active";
      explanation = `${recentInteractions.length} interactions in last 60 days`;
    } else if (recentInteractions.length === 1) {
      // 1 interaction recently
      if (contact.relationshipScore > 50) {
        newStage = "active";
        explanation = "Recent interaction with good relationship score";
      } else {
        newStage = "new";
        explanation = "Limited interaction history";
      }
    }

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
      await ctx.scheduler.runAfter(0, "lifecycle:updateLifecycleStage", {
        contactId: contact._id,
      });
    }

    return { processed: contacts.length };
  },
});
