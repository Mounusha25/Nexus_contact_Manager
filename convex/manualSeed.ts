import { mutation } from "./_generated/server";
import { v } from "convex/values";

// First, run this to see all users
export const listUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(u => ({
      _id: u._id,
      email: u.email,
      clerkUserId: u.clerkUserId,
      name: u.name,
    }));
  },
});

// Use the actual Convex user _id from the users table
export const manualSeed = mutation({
  args: {
    userId: v.string(), // Convex user _id like "j97abc123"
  },
  handler: async (ctx, args) => {
    // Get user directly by ID
    const user = await ctx.db.query("users").collect();
    const foundUser = user.find(u => u._id === args.userId);

    if (!foundUser) {
      return { 
        error: "User not found. Available users:",
        users: user.map(u => ({ _id: u._id, email: u.email }))
      };
    }

    // Check existing contacts
    const existing = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", foundUser._id))
      .collect();

    if (existing.length > 0) {
      return { error: `User already has ${existing.length} contacts` };
    }

    const now = Date.now();
    const contacts = [];

    // Create 10 contacts
    const c1 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Sarah Johnson",
      firstName: "Sarah",
      lastName: "Johnson",
      emails: ["sarah.j@techcorp.com"],
      phones: ["+1-555-0101"],
      company: "TechCorp",
      title: "Senior Engineer",
      tags: ["tech", "engineering"],
      relationshipScore: 85,
      lifecycleStage: "active",
      lastInteractionAt: now - 2 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c1);

    const c2 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Michael Chen",
      firstName: "Michael",
      lastName: "Chen",
      emails: ["m.chen@startupxyz.io"],
      phones: ["+1-555-0102"],
      company: "StartupXYZ",
      title: "Founder & CEO",
      tags: ["startup", "founder"],
      relationshipScore: 92,
      lifecycleStage: "active",
      lastInteractionAt: now - 1 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c2);

    const c3 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Emily Rodriguez",
      firstName: "Emily",
      lastName: "Rodriguez",
      emails: ["emily.r@designstudio.com"],
      phones: ["+1-555-0103"],
      company: "Design Studio",
      title: "Creative Director",
      tags: ["design", "ui/ux"],
      relationshipScore: 78,
      lifecycleStage: "active",
      lastInteractionAt: now - 5 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c3);

    const c4 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "David Park",
      firstName: "David",
      lastName: "Park",
      emails: ["david.park@consulting.com"],
      phones: [],
      company: "Park Consulting",
      title: "Strategy Consultant",
      tags: ["consulting", "strategy"],
      relationshipScore: 65,
      lifecycleStage: "active",
      lastInteractionAt: now - 10 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c4);

    const c5 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Lisa Anderson",
      firstName: "Lisa",
      lastName: "Anderson",
      emails: ["lisa@recruitpro.com"],
      phones: ["+1-555-0105"],
      company: "RecruitPro",
      title: "Technical Recruiter",
      tags: ["recruiting", "hr"],
      relationshipScore: 58,
      lifecycleStage: "dormant",
      lastInteractionAt: now - 35 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c5);

    const c6 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "James Wilson",
      firstName: "James",
      lastName: "Wilson",
      emails: ["j.wilson@bigtech.com"],
      phones: [],
      company: "BigTech Inc",
      title: "Product Manager",
      tags: ["product", "tech"],
      relationshipScore: 42,
      lifecycleStage: "dormant",
      lastInteractionAt: now - 50 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c6);

    const c7 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Maria Garcia",
      firstName: "Maria",
      lastName: "Garcia",
      emails: ["maria@socialimpact.org"],
      phones: ["+1-555-0107"],
      company: "Social Impact Org",
      title: "Program Director",
      tags: ["nonprofit", "education"],
      relationshipScore: 88,
      lifecycleStage: "active",
      lastInteractionAt: now - 3 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c7);

    const c8 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Robert Taylor",
      firstName: "Robert",
      lastName: "Taylor",
      emails: ["rob.taylor@ventures.vc"],
      phones: [],
      company: "Taylor Ventures",
      title: "Venture Capitalist",
      tags: ["vc", "investor"],
      relationshipScore: 70,
      lifecycleStage: "active",
      lastInteractionAt: now - 7 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c8);

    const c9 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Anna Kim",
      firstName: "Anna",
      lastName: "Kim",
      emails: ["anna.kim@newstech.com"],
      phones: [],
      company: "NewsTech Media",
      title: "Tech Journalist",
      tags: ["media", "journalism"],
      relationshipScore: 55,
      lifecycleStage: "new",
      lastInteractionAt: now - 15 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c9);

    const c10 = await ctx.db.insert("contacts", {
      userId: foundUser._id,
      name: "Chris Martinez",
      firstName: "Chris",
      lastName: "Martinez",
      emails: ["chris@devtools.io"],
      phones: ["+1-555-0110"],
      company: "DevTools.io",
      title: "DevRel Engineer",
      tags: ["developer", "devrel"],
      relationshipScore: 95,
      lifecycleStage: "active",
      lastInteractionAt: now - 1 * 24 * 60 * 60 * 1000,
      createdAt: now,
      updatedAt: now,
    });
    contacts.push(c10);

    // Add interactions
    await ctx.db.insert("interactions", {
      userId: foundUser._id,
      contactId: c1,
      type: "meeting",
      channel: "in-person",
      direction: "outbound",
      content: "Coffee meeting to discuss AI collaboration",
      timestamp: now - 2 * 24 * 60 * 60 * 1000,
      createdAt: now,
    });

    await ctx.db.insert("interactions", {
      userId: foundUser._id,
      contactId: c2,
      type: "call",
      channel: "phone",
      direction: "outbound",
      content: "Investment discussion",
      timestamp: now - 1 * 24 * 60 * 60 * 1000,
      createdAt: now,
    });

    await ctx.db.insert("interactions", {
      userId: foundUser._id,
      contactId: c10,
      type: "meeting",
      channel: "video-call",
      direction: "outbound",
      content: "Pair programming session",
      timestamp: now - 1 * 24 * 60 * 60 * 1000,
      createdAt: now,
    });

    // Add follow-ups
    await ctx.db.insert("followUps", {
      userId: foundUser._id,
      contactId: c4,
      dueAt: now + 1 * 24 * 60 * 60 * 1000,
      reason: "Follow up on strategy discussion",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("followUps", {
      userId: foundUser._id,
      contactId: c5,
      dueAt: now,
      reason: "Check in - haven't talked in a while",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Add note
    await ctx.db.insert("notes", {
      userId: foundUser._id,
      contactId: c2,
      rawText: "Investment meeting went well. Interested in leading seed round.",
      createdAt: now - 5 * 24 * 60 * 60 * 1000,
      updatedAt: now - 5 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: "Demo data created successfully!",
      userId: foundUser._id,
      contacts: contacts.length,
      interactions: 3,
      followUps: 2,
      notes: 1,
    };
  },
});
