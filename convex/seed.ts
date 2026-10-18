import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { recordAuditEvent } from "./lib/audit";
import { requireCurrentAccount } from "./lib/authorization";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const { actorClerkUserId, user } = await requireCurrentAccount(ctx);

    // Check if demo data already exists
    const existingContacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (existingContacts.length > 0) {
      return { message: "Demo data already exists", count: existingContacts.length };
    }

    // Create demo contacts
    const contacts = [
      {
        userId: user._id,
        name: "Sarah Johnson",
        firstName: "Sarah",
        lastName: "Johnson",
        emails: ["sarah.j@techcorp.com"],
        phones: ["+1-555-0101"],
        company: "TechCorp",
        title: "Senior Engineer",
        tags: ["tech", "engineering", "mentor"],
        relationshipScore: 85,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Michael Chen",
        firstName: "Michael",
        lastName: "Chen",
        emails: ["m.chen@startupxyz.io"],
        phones: ["+1-555-0102"],
        company: "StartupXYZ",
        title: "Founder & CEO",
        tags: ["startup", "founder", "investor"],
        relationshipScore: 92,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Emily Rodriguez",
        firstName: "Emily",
        lastName: "Rodriguez",
        emails: ["emily.r@designstudio.com"],
        phones: ["+1-555-0103"],
        company: "Design Studio",
        title: "Creative Director",
        tags: ["design", "ui/ux", "creative"],
        relationshipScore: 78,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "David Park",
        firstName: "David",
        lastName: "Park",
        emails: ["david.park@consulting.com"],
        phones: [],
        company: "Park Consulting",
        title: "Strategy Consultant",
        tags: ["consulting", "strategy", "business"],
        relationshipScore: 65,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Lisa Anderson",
        firstName: "Lisa",
        lastName: "Anderson",
        emails: ["lisa@recruitpro.com"],
        phones: ["+1-555-0105"],
        company: "RecruitPro",
        title: "Technical Recruiter",
        tags: ["recruiting", "hr", "talent"],
        relationshipScore: 58,
        lifecycleStage: "dormant" as const,
        lastInteractionAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "James Wilson",
        firstName: "James",
        lastName: "Wilson",
        emails: ["j.wilson@bigtech.com"],
        phones: [],
        company: "BigTech Inc",
        title: "Product Manager",
        tags: ["product", "tech", "enterprise"],
        relationshipScore: 42,
        lifecycleStage: "dormant" as const,
        lastInteractionAt: Date.now() - 50 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Maria Garcia",
        firstName: "Maria",
        lastName: "Garcia",
        emails: ["maria@socialimpact.org"],
        phones: ["+1-555-0107"],
        company: "Social Impact Org",
        title: "Program Director",
        tags: ["nonprofit", "social-impact", "education"],
        relationshipScore: 88,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Robert Taylor",
        firstName: "Robert",
        lastName: "Taylor",
        emails: ["rob.taylor@ventures.vc"],
        phones: [],
        company: "Taylor Ventures",
        title: "Venture Capitalist",
        tags: ["vc", "investor", "fintech"],
        relationshipScore: 70,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Anna Kim",
        firstName: "Anna",
        lastName: "Kim",
        emails: ["anna.kim@newstech.com"],
        phones: [],
        company: "NewsTech Media",
        title: "Tech Journalist",
        tags: ["media", "journalism", "tech-writer"],
        relationshipScore: 55,
        lifecycleStage: "new" as const,
        lastInteractionAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        userId: user._id,
        name: "Chris Martinez",
        firstName: "Chris",
        lastName: "Martinez",
        emails: ["chris@devtools.io"],
        phones: ["+1-555-0110"],
        company: "DevTools.io",
        title: "DevRel Engineer",
        tags: ["developer", "devrel", "open-source"],
        relationshipScore: 95,
        lifecycleStage: "active" as const,
        lastInteractionAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    const contactIds: Id<"contacts">[] = [];
    for (const contact of contacts) {
      const contactId = await ctx.db.insert("contacts", contact);
      contactIds.push(contactId);
    }

    // Create demo interactions for some contacts
    const interactions = [
      // Sarah Johnson interactions
      {
        userId: user._id,
        contactId: contactIds[0],
        type: "meeting" as const,
        channel: "in-person" as const,
        notes: "Coffee meeting to discuss AI project collaboration",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
      {
        userId: user._id,
        contactId: contactIds[0],
        type: "email" as const,
        channel: "email" as const,
        notes: "Sent project proposal and timeline",
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
      // Michael Chen interactions
      {
        userId: user._id,
        contactId: contactIds[1],
        type: "call" as const,
        channel: "phone" as const,
        notes: "Discussed potential investment opportunity",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
      {
        userId: user._id,
        contactId: contactIds[1],
        type: "meeting" as const,
        channel: "video-call" as const,
        notes: "Demo of product features and roadmap presentation",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      // Emily Rodriguez interactions
      {
        userId: user._id,
        contactId: contactIds[2],
        type: "email" as const,
        channel: "email" as const,
        notes: "Shared design mockups for review",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      // Chris Martinez interactions
      {
        userId: user._id,
        contactId: contactIds[9],
        type: "meeting" as const,
        channel: "video-call" as const,
        notes: "Pair programming session on open source project",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
      {
        userId: user._id,
        contactId: contactIds[9],
        type: "dm" as const,
        channel: "slack" as const,
        notes: "Quick check-in about code review",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      },
    ];

    for (const interaction of interactions) {
      const { notes, ...record } = interaction;
      await ctx.db.insert("interactions", {
        ...record,
        direction: "outbound",
        content: notes,
        createdAt: Date.now(),
      });
    }

    // Create demo follow-ups
    const followUps = [
      {
        userId: user._id,
        contactId: contactIds[3], // David Park
        dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000, // Tomorrow
        reason: "Follow up on strategy discussion",
        status: "pending" as const,
        urgency: "medium" as const,
      },
      {
        userId: user._id,
        contactId: contactIds[4], // Lisa Anderson
        dueDate: Date.now(), // Today
        reason: "Check in - haven't talked in a while",
        status: "pending" as const,
        urgency: "high" as const,
      },
      {
        userId: user._id,
        contactId: contactIds[7], // Robert Taylor
        dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // In 2 days
        reason: "Send updated pitch deck",
        status: "pending" as const,
        urgency: "medium" as const,
      },
    ];

    for (const followUp of followUps) {
      const { dueDate, urgency: _urgency, ...record } = followUp;
      void _urgency;
      await ctx.db.insert("followUps", {
        ...record,
        dueAt: dueDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Create demo notes for some contacts
    const notes = [
      {
        userId: user._id,
        contactId: contactIds[1], // Michael Chen
        content: "Investment meeting went well. He's interested in leading our seed round. Mentioned he wants to see traction metrics next month.",
        aiSummary: "Positive investor meeting - interested in leading seed round, wants traction data",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      {
        userId: user._id,
        contactId: contactIds[6], // Maria Garcia
        content: "Discussed an EdTech partnership and the need to prepare a proposal for the next board meeting.",
        aiSummary: "EdTech partnership opportunity - board proposal needed",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      },
    ];

    for (const note of notes) {
      const { content, timestamp, ...record } = note;
      await ctx.db.insert("notes", {
        ...record,
        rawText: content,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await recordAuditEvent(ctx, {
      userId: user._id,
      actorClerkUserId,
      action: "demo.seeded",
      entityType: "demo_data",
      entityId: user._id,
      summary: `Created ${contactIds.length} demo contacts`,
    });

    return { 
      message: "Demo data created successfully",
      contacts: contactIds.length,
      interactions: interactions.length,
      followUps: followUps.length,
      notes: notes.length,
    };
  },
});

// Helper mutation to clear all demo data
export const clearDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const { actorClerkUserId, user } = await requireCurrentAccount(ctx);

    // Delete all contacts (cascade will handle related data)
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const contact of contacts) {
      await ctx.db.delete(contact._id);
    }

    // Delete all interactions
    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const interaction of interactions) {
      await ctx.db.delete(interaction._id);
    }

    // Delete all follow-ups
    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const followUp of followUps) {
      await ctx.db.delete(followUp._id);
    }

    // Delete all notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    const dedupeCandidates = await ctx.db
      .query("dedupeCandidates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const candidate of dedupeCandidates) {
      await ctx.db.delete(candidate._id);
    }

    await recordAuditEvent(ctx, {
      userId: user._id,
      actorClerkUserId,
      action: "demo.cleared",
      entityType: "demo_data",
      entityId: user._id,
      summary: `Cleared ${contacts.length} contacts and related demo records`,
    });

    return {
      message: "Demo data cleared successfully",
      deleted: {
        contacts: contacts.length,
        interactions: interactions.length,
        followUps: followUps.length,
        notes: notes.length,
        dedupeCandidates: dedupeCandidates.length,
      },
    };
  },
});
