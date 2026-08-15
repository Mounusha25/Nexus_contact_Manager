import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDemoData = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if demo data already exists
    const existingContacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (existingContacts.length > 0) {
      return { message: "Demo data already exists", count: existingContacts.length };
    }

    // Create demo contacts
    const contacts = [
      {
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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
        userId: args.userId,
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

    const contactIds: string[] = [];
    for (const contact of contacts) {
      const contactId = await ctx.db.insert("contacts", contact);
      contactIds.push(contactId);
    }

    // Create demo interactions for some contacts
    const interactions = [
      // Sarah Johnson interactions
      {
        userId: args.userId,
        contactId: contactIds[0],
        type: "meeting" as const,
        channel: "in-person" as const,
        notes: "Coffee meeting to discuss AI project collaboration",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
      {
        userId: args.userId,
        contactId: contactIds[0],
        type: "email" as const,
        channel: "email" as const,
        notes: "Sent project proposal and timeline",
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
      // Michael Chen interactions
      {
        userId: args.userId,
        contactId: contactIds[1],
        type: "call" as const,
        channel: "phone" as const,
        notes: "Discussed potential investment opportunity",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
      {
        userId: args.userId,
        contactId: contactIds[1],
        type: "meeting" as const,
        channel: "video-call" as const,
        notes: "Demo of product features and roadmap presentation",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      // Emily Rodriguez interactions
      {
        userId: args.userId,
        contactId: contactIds[2],
        type: "email" as const,
        channel: "email" as const,
        notes: "Shared design mockups for review",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      // Chris Martinez interactions
      {
        userId: args.userId,
        contactId: contactIds[9],
        type: "meeting" as const,
        channel: "video-call" as const,
        notes: "Pair programming session on open source project",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
      {
        userId: args.userId,
        contactId: contactIds[9],
        type: "message" as const,
        channel: "slack" as const,
        notes: "Quick check-in about code review",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      },
    ];

    for (const interaction of interactions) {
      await ctx.db.insert("interactions", interaction);
    }

    // Create demo follow-ups
    const followUps = [
      {
        userId: args.userId,
        contactId: contactIds[3], // David Park
        dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000, // Tomorrow
        reason: "Follow up on strategy discussion",
        status: "pending" as const,
        urgency: "medium" as const,
      },
      {
        userId: args.userId,
        contactId: contactIds[4], // Lisa Anderson
        dueDate: Date.now(), // Today
        reason: "Check in - haven't talked in a while",
        status: "pending" as const,
        urgency: "high" as const,
      },
      {
        userId: args.userId,
        contactId: contactIds[7], // Robert Taylor
        dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // In 2 days
        reason: "Send updated pitch deck",
        status: "pending" as const,
        urgency: "medium" as const,
      },
    ];

    for (const followUp of followUps) {
      await ctx.db.insert("followUps", followUp);
    }

    // Create demo notes for some contacts
    const notes = [
      {
        userId: args.userId,
        contactId: contactIds[1], // Michael Chen
        content: "Investment meeting went well. He's interested in leading our seed round. Mentioned he wants to see traction metrics next month.",
        aiSummary: "Positive investor meeting - interested in leading seed round, wants traction data",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      {
        userId: args.userId,
        contactId: contactIds[6], // Maria Garcia
        content: "Discussed EdTech partnership. Her org has 50K+ students who could benefit from our platform. Need to prepare proposal for board meeting.",
        aiSummary: "Partnership opportunity with 50K student reach - board proposal needed",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      },
    ];

    for (const note of notes) {
      await ctx.db.insert("notes", note);
    }

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
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Delete all contacts (cascade will handle related data)
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const contact of contacts) {
      await ctx.db.delete(contact._id);
    }

    // Delete all interactions
    const interactions = await ctx.db
      .query("interactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const interaction of interactions) {
      await ctx.db.delete(interaction._id);
    }

    // Delete all follow-ups
    const followUps = await ctx.db
      .query("followUps")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const followUp of followUps) {
      await ctx.db.delete(followUp._id);
    }

    // Delete all notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    return {
      message: "Demo data cleared successfully",
      deleted: {
        contacts: contacts.length,
        interactions: interactions.length,
        followUps: followUps.length,
        notes: notes.length,
      },
    };
  },
});
