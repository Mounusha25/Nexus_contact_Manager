import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export type AuditAction =
  | "account.created"
  | "profile.updated"
  | "contact.created"
  | "contact.updated"
  | "contact.deleted"
  | "contact.auto_tagged"
  | "contacts.merged"
  | "duplicate.ignored"
  | "interaction.created"
  | "follow_up.created"
  | "follow_up.completed"
  | "follow_up.skipped"
  | "demo.seeded"
  | "demo.cleared";

export type AuditEntityType =
  | "account"
  | "contact"
  | "interaction"
  | "follow_up"
  | "duplicate_candidate"
  | "demo_data";

type AuditEvent = {
  userId: Id<"users">;
  actorClerkUserId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  summary: string;
};

export async function recordAuditEvent(
  ctx: Pick<MutationCtx, "db">,
  event: AuditEvent
) {
  return ctx.db.insert("auditEvents", {
    ...event,
    occurredAt: Date.now(),
  });
}
