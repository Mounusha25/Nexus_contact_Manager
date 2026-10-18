/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/!(*.*.*)*.*s");

function contact(name: string, email: string) {
  return {
    name,
    emails: [email],
    phones: [],
    tags: [],
  };
}

async function createAccount(
  testBackend: ReturnType<typeof convexTest>,
  subject: string
) {
  const client = testBackend.withIdentity({
    subject,
    issuer: "https://clerk.example.test",
    email: `${subject}@example.test`,
    name: subject,
  });
  await client.mutation(api.users.ensureUser, {});
  return client;
}

describe("authentication and ownership boundaries", () => {
  test("anonymous callers cannot mutate contacts", async () => {
    const backend = convexTest(schema, modules);

    await expect(
      backend.mutation(
        api.contacts.createContact,
        contact("Anonymous Contact", "anonymous@example.test")
      )
    ).rejects.toThrow("Not authenticated");

    expect(await backend.query(api.auditEvents.listAuditEvents, {})).toEqual([]);
  });

  test("one account cannot read or change another account's contact", async () => {
    const backend = convexTest(schema, modules);
    const alice = await createAccount(backend, "alice");
    const bob = await createAccount(backend, "bob");
    const aliceContactId = await alice.mutation(
      api.contacts.createContact,
      contact("Alice Contact", "alice-contact@example.test")
    );

    expect(await bob.query(api.contacts.getContact, { id: aliceContactId })).toBeNull();
    await expect(
      bob.mutation(api.contacts.updateContact, {
        id: aliceContactId,
        company: "Unauthorized Company",
      })
    ).rejects.toThrow("Resource not found");
    await expect(
      bob.mutation(api.contacts.deleteContact, { id: aliceContactId })
    ).rejects.toThrow("Resource not found");
    await expect(
      bob.mutation(api.interactions.logInteraction, {
        contactId: aliceContactId,
        type: "email",
        direction: "outbound",
      })
    ).rejects.toThrow("Resource not found");
    await expect(
      bob.mutation(api.followUps.createFollowUp, {
        contactId: aliceContactId,
        reason: "Should be denied",
        dueAt: Date.now() + 60_000,
      })
    ).rejects.toThrow("Resource not found");

    const aliceContact = await alice.query(api.contacts.getContact, {
      id: aliceContactId,
    });
    expect(aliceContact?.company).toBeUndefined();

    const bobActions = (await bob.query(api.auditEvents.listAuditEvents, {})).map(
      (event) => event.action
    );
    expect(bobActions).toEqual(["account.created"]);
  });

  test("cross-account merges are rejected", async () => {
    const backend = convexTest(schema, modules);
    const alice = await createAccount(backend, "alice");
    const bob = await createAccount(backend, "bob");
    const aliceContactId = await alice.mutation(
      api.contacts.createContact,
      contact("Alice Contact", "alice-contact@example.test")
    );
    const bobContactId = await bob.mutation(
      api.contacts.createContact,
      contact("Bob Contact", "bob-contact@example.test")
    );

    await expect(
      alice.mutation(api.deduplication.mergeContacts, {
        primaryId: aliceContactId,
        duplicateId: bobContactId,
        fieldPreferences: {},
      })
    ).rejects.toThrow("Resource not found");

    expect(
      await bob.query(api.contacts.getContact, { id: bobContactId })
    ).not.toBeNull();
  });
});

describe("append-only audit history", () => {
  test("events remain account-scoped after the target contact is deleted", async () => {
    const backend = convexTest(schema, modules);
    const alice = await createAccount(backend, "alice");
    const bob = await createAccount(backend, "bob");
    const contactId = await alice.mutation(
      api.contacts.createContact,
      contact("Persistent History", "history@example.test")
    );

    await alice.mutation(api.contacts.updateContact, {
      id: contactId,
      company: "Nexus Labs",
    });
    await alice.mutation(api.contacts.deleteContact, { id: contactId });

    const aliceEvents = await alice.query(api.auditEvents.listAuditEvents, {
      limit: 100,
    });
    const contactEvents = aliceEvents.filter(
      (event) => event.entityId === contactId
    );
    expect(contactEvents.map((event) => event.action).sort()).toEqual([
      "contact.created",
      "contact.deleted",
      "contact.updated",
    ]);
    expect(contactEvents.every((event) => event.actorClerkUserId === "alice")).toBe(
      true
    );

    const bobEvents = await bob.query(api.auditEvents.listAuditEvents, {});
    expect(bobEvents.every((event) => event.userId !== aliceEvents[0].userId)).toBe(
      true
    );
  });

  test("follow-up state changes produce immutable audit entries", async () => {
    const backend = convexTest(schema, modules);
    const alice = await createAccount(backend, "alice");
    const contactId = await alice.mutation(
      api.contacts.createContact,
      contact("Follow Up Contact", "follow-up@example.test")
    );
    const followUpId = await alice.mutation(api.followUps.createFollowUp, {
      contactId,
      reason: "Reconnect",
      dueAt: Date.now() + 60_000,
    });
    await alice.mutation(api.followUps.markFollowUpDone, { id: followUpId });

    const actions = (await alice.query(api.auditEvents.listAuditEvents, {})).map(
      (event) => event.action
    );
    expect(actions).toContain("follow_up.created");
    expect(actions).toContain("follow_up.completed");
  });
});
