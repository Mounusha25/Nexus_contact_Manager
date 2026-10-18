"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { ScrollText, ShieldCheck } from "lucide-react";

const labels: Record<string, string> = {
  "account.created": "Account created",
  "profile.updated": "Profile updated",
  "contact.created": "Contact created",
  "contact.updated": "Contact updated",
  "contact.deleted": "Contact deleted",
  "contact.auto_tagged": "Contact classified",
  "contacts.merged": "Contacts merged",
  "duplicate.ignored": "Duplicate ignored",
  "interaction.created": "Interaction recorded",
  "follow_up.created": "Follow-up created",
  "follow_up.completed": "Follow-up completed",
  "follow_up.skipped": "Follow-up skipped",
  "demo.seeded": "Demo data created",
  "demo.cleared": "Demo data cleared",
};

const dateTime = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function AuditLogPage() {
  const events = useQuery(api.auditEvents.listAuditEvents, { limit: 100 });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-yellow-400/10 p-3 text-yellow-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Audit log</h1>
            <p className="text-gray-400">
              An append-only history of security-relevant changes to your account.
            </p>
          </div>
        </div>
      </header>

      <Card className="overflow-hidden border-gray-800 bg-gray-950/70">
        {events === undefined ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded-lg bg-gray-800" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <ScrollText className="h-10 w-10 text-gray-600" />
            <div>
              <p className="font-medium text-gray-200">No activity recorded yet</p>
              <p className="text-sm text-gray-500">
                Changes to contacts, follow-ups, and your profile will appear here.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {events.map((event) => (
              <li
                key={event._id}
                className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-100">
                    {labels[event.action] ?? event.action}
                  </p>
                  <p className="text-sm text-gray-400">{event.summary}</p>
                </div>
                <time
                  className="shrink-0 text-xs text-gray-500"
                  dateTime={new Date(event.occurredAt).toISOString()}
                >
                  {dateTime.format(event.occurredAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
