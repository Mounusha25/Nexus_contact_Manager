import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Chat with AI assistant
export const chatWithAssistant = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let userId: any;
    
    if (args.userId) {
      // Use provided userId (for testing with hardcoded ID)
      userId = args.userId;
    } else {
      // Try to get authenticated user
      const user = await ctx.runQuery(api.users.getCurrentUser);
      if (!user) throw new Error("Not authenticated");
      userId = user._id;
    }

    try {
      // Get user's context - contacts, recent interactions, follow-ups
      const contacts = await ctx.runQuery(api.contacts.getContactsByUserId, { userId });
      const analytics = await ctx.runQuery(api.analytics.getDashboardAnalyticsByUserId, { userId });

      // Build context for Claude
      const contextData = {
        totalContacts: contacts.length,
        strongRelationships: contacts.filter((c) => c.relationshipScore > 70).length,
        pendingFollowUps: analytics?.pendingFollowUps || 0,
        topContacts: contacts
          .slice(0, 10)
          .map((c) => ({
            name: c.name,
            company: c.company,
            score: c.relationshipScore,
            stage: c.lifecycleStage,
            autoType: c.autoType,
          })),
        atRiskContacts: analytics?.atRiskContacts || [],
      };

      const systemPrompt = `You are an AI networking coach and contact intelligence assistant for a Smart Contact Manager app. Your role is to help users build and maintain professional relationships.

You have access to the user's contact data:
- Total contacts: ${contextData.totalContacts}
- Strong relationships (score > 70): ${contextData.strongRelationships}
- Pending follow-ups: ${contextData.pendingFollowUps}

Top contacts by relationship score:
${contextData.topContacts.map((c) => `- ${c.name} (${c.company || "No company"}) - Score: ${c.score} - ${c.stage} - ${c.autoType || "other"}`).join("\n")}

At-risk contacts needing attention:
${contextData.atRiskContacts.slice(0, 5).map((c: any) => `- ${c.name} (${c.company || "No company"}) - Score: ${c.relationshipScore} - ${c.lifecycleStage}`).join("\n")}

Guidelines:
1. Be concise and actionable
2. Provide specific recommendations based on relationship scores and lifecycle stages
3. When suggesting follow-ups, explain why and suggest conversation starters
4. Help draft emails/messages when requested
5. Identify patterns and opportunities in the user's network
6. Respect privacy - only use this user's data
7. When giving contact suggestions, reference them by name
8. Use data to back up your recommendations (e.g., "You haven't contacted Sarah in 45 days and her score is falling")

Example tasks you can help with:
- "Who should I reconnect with this week?"
- "Draft an email to follow up with Alex about the job opportunity"
- "Show me all dormant contacts in fintech"
- "Who are my strongest recruiter connections?"`;

      // MOCK RESPONSE FOR TESTING - Replace with real API when you have a valid Anthropic key
      const userQuery = args.messages[args.messages.length - 1].content.toLowerCase();
      
      let mockResponse = "";
      
      if (userQuery.includes("top") || userQuery.includes("best") || userQuery.includes("strongest")) {
        mockResponse = `Based on your network data, here are your top contacts:\n\n${contextData.topContacts.slice(0, 5).map((c, i) => `${i + 1}. **${c.name}** at ${c.company || "N/A"}\n   - Relationship Score: ${c.score}/100\n   - Stage: ${c.stage}\n   - Type: ${c.autoType || "general"}`).join("\n\n")}\n\nThese contacts have the highest relationship scores and are actively engaged with you.`;
      } else if (userQuery.includes("recruiter")) {
        const recruiters = contextData.topContacts.filter(c => c.autoType === "recruiter");
        mockResponse = `You have ${recruiters.length} recruiter connections in your network:\n\n${recruiters.map((c, i) => `${i + 1}. **${c.name}** at ${c.company || "N/A"}\n   - Score: ${c.score}/100\n   - Stage: ${c.stage}`).join("\n\n")}\n\n${recruiters.length > 0 ? "These recruiters are valuable for job opportunities and career growth. Keep them engaged!" : "Consider building more recruiter relationships to expand your opportunities."}`;
      } else if (userQuery.includes("reconnect") || userQuery.includes("follow up") || userQuery.includes("reach out")) {
        const atRisk = contextData.atRiskContacts.slice(0, 3);
        mockResponse = `Here are contacts you should reconnect with this week:\n\n${atRisk.length > 0 ? atRisk.map((c: any, i: number) => `${i + 1}. **${c.name}** at ${c.company || "N/A"}\n   - Score: ${c.relationshipScore}/100 (${c.lifecycleStage})\n   - Why: ${c.lifecycleStage === "dormant" ? "Haven't connected recently" : "High score contact needing attention"}\n   - Suggestion: Send a casual check-in message or share an article relevant to their work`).join("\n\n") : "Great job! All your important contacts are well-maintained."}\n\nFocus on high-value relationships that are going dormant.`;
      } else if (userQuery.includes("email") || userQuery.includes("draft") || userQuery.includes("write")) {
        const contact = contextData.topContacts[0];
        mockResponse = `Here's a draft follow-up email for **${contact.name}**:\n\n---\n\nSubject: Checking in\n\nHi ${contact.name.split(" ")[0]},\n\nI hope this message finds you well! I wanted to reach out to catch up.\n\n${contact.autoType === "recruiter" ? "I'm currently exploring new opportunities and would love to hear about what's happening in the market." : "I'd love to hear what you've been working on lately."}\n\nWould you be available for a quick call next week?\n\nBest regards,\n[Your Name]\n\n---\n\nFeel free to customize this based on your specific context with ${contact.name}.`;
      } else if (userQuery.includes("how many") || userQuery.includes("stats") || userQuery.includes("overview")) {
        mockResponse = `Here's your network overview:\n\n📊 **Network Stats:**\n- Total Contacts: ${contextData.totalContacts}\n- Strong Relationships (>70 score): ${contextData.strongRelationships}\n- Pending Follow-ups: ${contextData.pendingFollowUps}\n\nYou're doing well maintaining ${contextData.strongRelationships} strong relationships!`;
      } else {
        mockResponse = `I'm here to help you manage your professional network! Here's what I can do:\n\n✅ **Identify top contacts** - "Who are my strongest connections?"\n✅ **Find reconnection opportunities** - "Who should I follow up with?"\n✅ **Filter by type** - "Show me all recruiters"\n✅ **Draft messages** - "Write an email to Sarah"\n✅ **Network insights** - "What are my network stats?"\n\nYou currently have **${contextData.totalContacts} contacts** with **${contextData.strongRelationships} strong relationships**. What would you like to know?`;
      }

      return {
        role: "assistant" as const,
        content: mockResponse,
      };

      /* REAL ANTHROPIC API CODE - Uncomment when you have a valid API key
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        system: systemPrompt,
        messages: args.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage = response.content[0].type === "text" ? response.content[0].text : "";

      return {
        role: "assistant" as const,
        content: assistantMessage,
      };
      */
    } catch (error) {
      console.error("AI assistant error:", error);
      return {
        role: "assistant" as const,
        content: "I'm having trouble processing that request right now. Please try again.",
      };
    }
  },
});

// Parse natural language search query into structured filter
export const parseSearchQuery = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const systemPrompt = `You are a query parser for a contact management system. Convert natural language queries into structured JSON filters.

Available fields:
- lifecycleStage: "new" | "active" | "dormant" | "archived"
- autoType: "recruiter" | "client" | "investor" | "friend" | "other"
- industry: string
- relationshipScore: { min: number, max: number }
- lastInteractionBefore: number (days ago)
- lastInteractionAfter: number (days ago)

Examples:
Query: "recruiters from fintech"
Output: { "autoType": "recruiter", "industry": "fintech" }

Query: "people I met last month"
Output: { "lastInteractionAfter": 30, "lastInteractionBefore": 0 }

Query: "dormant contacts with high scores"
Output: { "lifecycleStage": "dormant", "relationshipScore": { "min": 70, "max": 100 } }

Query: "investors in SF"
Output: { "autoType": "investor", "location": "SF" }

Return ONLY valid JSON, no explanation.`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: args.query,
          },
        ],
      });

      const resultText = response.content[0].type === "text" ? response.content[0].text : "{}";

      // Try to parse JSON
      try {
        const filters = JSON.parse(resultText);
        return filters;
      } catch {
        return {};
      }
    } catch (error) {
      console.error("Parse query error:", error);
      return {};
    }
  },
});

// Generate email draft
export const generateEmailDraft = action({
  args: {
    contactName: v.string(),
    context: v.string(),
    purpose: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const prompt = `Draft a professional but warm email to ${args.contactName}.

Context: ${args.context}
Purpose: ${args.purpose}

Guidelines:
- Keep it concise (2-3 short paragraphs)
- Be genuine and personable
- Include a clear call-to-action
- Reference shared context naturally
- Don't use overly formal language

Return only the email body (no subject line).`;

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const emailDraft = response.content[0].type === "text" ? response.content[0].text : "";

      return emailDraft;
    } catch (error) {
      console.error("Email generation error:", error);
      return "Unable to generate email draft. Please try again.";
    }
  },
});
