import { query } from "./_generated/server";
import { v } from "convex/values";

// Query to get contacts by userId directly (for testing)
export const getContactsByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return contacts;
  },
});
