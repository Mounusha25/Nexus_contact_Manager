import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { calculateRelationshipScore } from "../lib/crm/contact-intelligence";

export const computeRelationshipScore = internalMutation({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const contact = await ctx.db.get(args.contactId);
    if (!contact) return null;

    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_contact_timestamp", (q) => q.eq("contactId", args.contactId))
      .collect();

    const relationshipScore = calculateRelationshipScore(interactions);
    await ctx.db.patch(args.contactId, {
      relationshipScore,
      updatedAt: Date.now(),
    });

    return relationshipScore;
  },
});
