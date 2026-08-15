import { query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get dashboard analytics
export const getDashboardAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return null;

    // Get all contacts
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Total contacts
    const totalContacts = contacts.length;

    // Contacts by lifecycle stage
    const newContacts = contacts.filter((c) => c.lifecycleStage === "new").length;
    const activeContacts = contacts.filter((c) => c.lifecycleStage === "active").length;
    const dormantContacts = contacts.filter((c) => c.lifecycleStage === "dormant").length;

    // Strong relationships (score > 70)
    const strongRelationships = contacts.filter((c) => c.relationshipScore > 70).length;

    // Contacts by autoType
    const recruiters = contacts.filter((c) => c.autoType === "recruiter").length;
    const clients = contacts.filter((c) => c.autoType === "client").length;
    const investors = contacts.filter((c) => c.autoType === "investor").length;

    // Get pending follow-ups
    const pendingFollowUps = await ctx.db
      .query("followUps")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "pending")
      )
      .collect();

    // Get interactions in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentInteractions = await ctx.db
      .query("interactions")
      .withIndex("by_user_timestamp", (q) => q.eq("userId", user._id))
      .filter((q) => q.gte(q.field("timestamp"), thirtyDaysAgo))
      .collect();

    // Network growth over time (last 6 months)
    const networkGrowth: Array<{ month: string; count: number }> = [];
    const now = Date.now();

    for (let i = 5; i >= 0; i--) {
      const monthStart = now - i * 30 * 24 * 60 * 60 * 1000;
      const monthContacts = contacts.filter((c) => c.createdAt <= monthStart);

      const date = new Date(monthStart);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      networkGrowth.push({ month: monthName, count: monthContacts.length });
    }

    // Industry distribution
    const industryMap = new Map<string, number>();
    contacts.forEach((c) => {
      if (c.industry) {
        industryMap.set(c.industry, (industryMap.get(c.industry) || 0) + 1);
      }
    });

    const industryDistribution = Array.from(industryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // At-risk relationships (score falling or dormant with high score)
    const atRiskContacts = contacts
      .filter((c) => 
        (c.lifecycleStage === "dormant" && c.relationshipScore > 50) ||
        (c.relationshipScore > 60 && !c.lastInteractionAt)
      )
      .sort((a, b) => b.relationshipScore - a.relationshipScore)
      .slice(0, 5);

    // Average relationship score with recruiters
    const recruiterContacts = contacts.filter((c) => c.autoType === "recruiter");
    const avgRecruiterScore =
      recruiterContacts.length > 0
        ? Math.round(
            recruiterContacts.reduce((sum, c) => sum + c.relationshipScore, 0) /
              recruiterContacts.length
          )
        : 0;

    return {
      totalContacts,
      newContacts,
      activeContacts,
      dormantContacts,
      strongRelationships,
      recruiters,
      clients,
      investors,
      pendingFollowUps: pendingFollowUps.length,
      recentInteractions: recentInteractions.length,
      networkGrowth,
      industryDistribution,
      atRiskContacts,
      avgRecruiterScore,
    };
  },
});

// Get dashboard analytics by user ID (for debugging)
export const getDashboardAnalyticsByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get all contacts
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Total contacts
    const totalContacts = contacts.length;

    // Contacts by lifecycle stage
    const newContacts = contacts.filter((c) => c.lifecycleStage === "new").length;
    const activeContacts = contacts.filter((c) => c.lifecycleStage === "active").length;
    const dormantContacts = contacts.filter((c) => c.lifecycleStage === "dormant").length;

    // Strong relationships (score > 70)
    const strongRelationships = contacts.filter((c) => c.relationshipScore > 70).length;

    // Contacts by autoType
    const recruiters = contacts.filter((c) => c.autoType === "recruiter").length;
    const clients = contacts.filter((c) => c.autoType === "client").length;
    const investors = contacts.filter((c) => c.autoType === "investor").length;

    // Get pending follow-ups
    const pendingFollowUps = await ctx.db
      .query("followUps")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", args.userId).eq("status", "pending")
      )
      .collect();

    // Get interactions in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentInteractions = await ctx.db
      .query("interactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const recentInteractionsCount = recentInteractions.filter(
      (i) => i.timestamp > thirtyDaysAgo
    ).length;

    // Network growth (contacts added in last 30 days)
    const networkGrowth = contacts.filter(
      (c) => c.createdAt > thirtyDaysAgo
    ).length;

    // Industry distribution
    const industryMap: Record<string, number> = {};
    contacts.forEach((c) => {
      if (c.industry) {
        industryMap[c.industry] = (industryMap[c.industry] || 0) + 1;
      }
    });
    const industryDistribution = Object.entries(industryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // At-risk relationships
    const atRiskContacts = contacts
      .filter((c) => 
        (c.lifecycleStage === "dormant" && c.relationshipScore > 50) ||
        (c.relationshipScore > 60 && !c.lastInteractionAt)
      )
      .sort((a, b) => b.relationshipScore - a.relationshipScore)
      .slice(0, 5);

    // Average relationship score with recruiters
    const recruiterContacts = contacts.filter((c) => c.autoType === "recruiter");
    const avgRecruiterScore =
      recruiterContacts.length > 0
        ? Math.round(
            recruiterContacts.reduce((sum, c) => sum + c.relationshipScore, 0) /
              recruiterContacts.length
          )
        : 0;

    return {
      totalContacts,
      newContacts,
      activeContacts,
      dormantContacts,
      strongRelationships,
      recruiters,
      clients,
      investors,
      pendingFollowUps: pendingFollowUps.length,
      recentInteractions: recentInteractionsCount,
      networkGrowth,
      industryDistribution,
      atRiskContacts,
      avgRecruiterScore,
    };
  },
});

// Get relationship distribution (for charts)
export const getRelationshipDistribution = query({
  args: {},
  handler: async (ctx) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!user) return [];

    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Bucket contacts by score
    const weak = contacts.filter((c) => c.relationshipScore < 40).length;
    const moderate = contacts.filter(
      (c) => c.relationshipScore >= 40 && c.relationshipScore < 70
    ).length;
    const strong = contacts.filter((c) => c.relationshipScore >= 70).length;

    return [
      { name: "Weak (0-39)", value: weak },
      { name: "Moderate (40-69)", value: moderate },
      { name: "Strong (70-100)", value: strong },
    ];
  },
});
