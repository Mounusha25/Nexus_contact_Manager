import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create user manually with Clerk ID
export const createUserManually = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existingUser) {
      return { 
        exists: true, 
        userId: existingUser._id,
        message: "User already exists" 
      };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { 
      exists: false, 
      userId,
      message: "User created successfully" 
    };
  },
});
