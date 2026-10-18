import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

type AssistantReply = { role: "assistant"; content: string };
type AssistantAnalytics = {
  strongRelationships: number;
  pendingFollowUps: number;
  atRiskContacts: Doc<"contacts">[];
};

export const chatWithAssistant = action({
  args: {
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    })),
  },
  handler: async (ctx, args): Promise<AssistantReply> => {
    const user = await ctx.runQuery(api.users.getCurrentUser);
    if (!user) throw new Error("Not authenticated");

    const contacts: Doc<"contacts">[] = await ctx.runQuery(api.contacts.getContacts, {});
    const analytics: AssistantAnalytics | null = await ctx.runQuery(
      api.analytics.getDashboardAnalytics,
      {},
    );
    const topContacts = contacts.slice(0, 10);
    const userQuery = args.messages.at(-1)?.content.trim().toLowerCase() ?? "";

    if (userQuery.includes("top") || userQuery.includes("best") || userQuery.includes("strongest")) {
      const list = topContacts.slice(0, 5).map((contact, index) =>
        `${index + 1}. **${contact.name}** at ${contact.company || "N/A"}\n` +
        `   - Relationship score: ${contact.relationshipScore}/100\n` +
        `   - Stage: ${contact.lifecycleStage}`,
      ).join("\n\n");
      return {
        role: "assistant" as const,
        content: list || "Add contacts and interactions before requesting a relationship ranking.",
      };
    }

    if (userQuery.includes("recruiter")) {
      const recruiters = contacts.filter((contact) => contact.autoType === "recruiter");
      const list = recruiters.slice(0, 10).map((contact, index) =>
        `${index + 1}. **${contact.name}** at ${contact.company || "N/A"} — ${contact.relationshipScore}/100`,
      ).join("\n");
      return {
        role: "assistant" as const,
        content: recruiters.length > 0
          ? `You have ${recruiters.length} recruiter contact(s):\n\n${list}`
          : "You do not have any contacts currently classified as recruiters.",
      };
    }

    if (userQuery.includes("reconnect") || userQuery.includes("follow up") || userQuery.includes("reach out")) {
      const atRisk = analytics?.atRiskContacts ?? [];
      const list = atRisk.slice(0, 5).map((contact, index) =>
        `${index + 1}. **${contact.name}** at ${contact.company || "N/A"} — ` +
        `${contact.relationshipScore}/100 (${contact.lifecycleStage})`,
      ).join("\n");
      return {
        role: "assistant" as const,
        content: list
          ? `Prioritize these relationships:\n\n${list}\n\nSend a short, specific check-in tied to your last conversation.`
          : "No high-value dormant relationships currently need attention.",
      };
    }

    if (userQuery.includes("email") || userQuery.includes("draft") || userQuery.includes("write")) {
      const contact = topContacts[0];
      return {
        role: "assistant" as const,
        content: contact
          ? `Subject: Checking in\n\nHi ${contact.name.split(" ")[0]},\n\nI hope you're doing well. I wanted to reconnect and hear what you've been working on lately. Would you be available for a quick call next week?\n\nBest,\n[Your name]`
          : "Add a contact before requesting a personalized follow-up draft.",
      };
    }

    if (userQuery.includes("how many") || userQuery.includes("stats") || userQuery.includes("overview")) {
      return {
        role: "assistant" as const,
        content: `Network overview:\n- Total contacts: ${contacts.length}\n- Strong relationships: ${analytics?.strongRelationships ?? 0}\n- Pending follow-ups: ${analytics?.pendingFollowUps ?? 0}`,
      };
    }

    return {
      role: "assistant" as const,
      content: "I can rank your strongest contacts, find recruiters, identify relationships to revisit, draft a check-in, or summarize your network.",
    };
  },
});
