/* eslint-disable */
/**
 * Generated Convex API references.
 *
 * Regenerate with `npx convex dev` after connecting a Convex deployment.
 */
import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import { anyApi } from "convex/server";
import type * as aiAssistant from "../aiAssistant.js";
import type * as analytics from "../analytics.js";
import type * as auditEvents from "../auditEvents.js";
import type * as contacts from "../contacts.js";
import type * as deduplication from "../deduplication.js";
import type * as followUps from "../followUps.js";
import type * as interactions from "../interactions.js";
import type * as lifecycle from "../lifecycle.js";
import type * as scoring from "../scoring.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

const fullApi: ApiFromModules<{
  aiAssistant: typeof aiAssistant;
  analytics: typeof analytics;
  auditEvents: typeof auditEvents;
  contacts: typeof contacts;
  deduplication: typeof deduplication;
  followUps: typeof followUps;
  interactions: typeof interactions;
  lifecycle: typeof lifecycle;
  scoring: typeof scoring;
  seed: typeof seed;
  users: typeof users;
}> = anyApi as any;

export const api: FilterApi<typeof fullApi, FunctionReference<any, "public">> = anyApi as any;
export const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">> = anyApi as any;
