import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    headline: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("student"),
      v.literal("engineer"),
      v.literal("founder"),
      v.literal("recruiter")
    )),
    goal: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_email", ["email"]),

  contacts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    emails: v.array(v.string()),
    phones: v.array(v.string()),
    company: v.optional(v.string()),
    title: v.optional(v.string()),
    location: v.optional(v.string()),
    industry: v.optional(v.string()),
    tags: v.array(v.string()),
    relationshipScore: v.number(),
    lifecycleStage: v.union(
      v.literal("new"),
      v.literal("active"),
      v.literal("dormant"),
      v.literal("archived")
    ),
    lastInteractionAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    aiNotesSummary: v.optional(v.string()),
    autoType: v.optional(v.union(
      v.literal("recruiter"),
      v.literal("client"),
      v.literal("investor"),
      v.literal("friend"),
      v.literal("other")
    )),
  })
    .index("by_user", ["userId"])
    .index("by_user_score", ["userId", "relationshipScore"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_user_last_interaction", ["userId", "lastInteractionAt"])
    .index("by_user_industry", ["userId", "industry"])
    .index("by_user_lifecycle", ["userId", "lifecycleStage"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    })
    .searchIndex("search_company", {
      searchField: "company",
      filterFields: ["userId"],
    }),

  interactions: defineTable({
    contactId: v.id("contacts"),
    userId: v.id("users"),
    type: v.union(
      v.literal("email"),
      v.literal("call"),
      v.literal("meeting"),
      v.literal("dm"),
      v.literal("other")
    ),
    channel: v.optional(v.string()),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    content: v.optional(v.string()),
    timestamp: v.number(),
    sentimentScore: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_contact", ["contactId"])
    .index("by_user", ["userId"])
    .index("by_user_contact", ["userId", "contactId"])
    .index("by_user_timestamp", ["userId", "timestamp"])
    .index("by_contact_timestamp", ["contactId", "timestamp"]),

  followUps: defineTable({
    contactId: v.id("contacts"),
    userId: v.id("users"),
    reason: v.string(),
    dueAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("done"),
      v.literal("skipped")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_status", ["userId", "status"])
    .index("by_user_due", ["userId", "dueAt"])
    .index("by_contact", ["contactId"]),

  notes: defineTable({
    contactId: v.id("contacts"),
    userId: v.id("users"),
    rawText: v.string(),
    aiSummary: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_contact", ["contactId"])
    .index("by_user", ["userId"])
    .searchIndex("search_notes", {
      searchField: "rawText",
      filterFields: ["userId", "contactId"],
    }),

  dedupeCandidates: defineTable({
    userId: v.id("users"),
    primaryContactId: v.id("contacts"),
    duplicateContactId: v.id("contacts"),
    confidence: v.number(),
    status: v.union(
      v.literal("suggested"),
      v.literal("merged"),
      v.literal("ignored")
    ),
    createdAt: v.number(),
  })
    .index("by_user_status", ["userId", "status"])
    .index("by_primary", ["primaryContactId"])
    .index("by_duplicate", ["duplicateContactId"]),
});
