import { query } from "./_generated/server";
import { v } from "convex/values";

export const listAuditEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (index) =>
        index.eq("clerkUserId", identity.subject)
      )
      .unique();
    if (!user) return [];

    const limit = Math.max(1, Math.min(args.limit ?? 50, 100));
    return ctx.db
      .query("auditEvents")
      .withIndex("by_user_occurred", (index) => index.eq("userId", user._id))
      .order("desc")
      .take(limit);
  },
});
