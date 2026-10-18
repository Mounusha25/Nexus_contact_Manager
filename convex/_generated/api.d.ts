/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiAssistant from "../aiAssistant.js";
import type * as analytics from "../analytics.js";
import type * as auditEvents from "../auditEvents.js";
import type * as auth from "../auth.js";
import type * as contacts from "../contacts.js";
import type * as deduplication from "../deduplication.js";
import type * as followUps from "../followUps.js";
import type * as interactions from "../interactions.js";
import type * as lib_audit from "../lib/audit.js";
import type * as lib_authorization from "../lib/authorization.js";
import type * as lifecycle from "../lifecycle.js";
import type * as scoring from "../scoring.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiAssistant: typeof aiAssistant;
  analytics: typeof analytics;
  auditEvents: typeof auditEvents;
  auth: typeof auth;
  contacts: typeof contacts;
  deduplication: typeof deduplication;
  followUps: typeof followUps;
  interactions: typeof interactions;
  "lib/audit": typeof lib_audit;
  "lib/authorization": typeof lib_authorization;
  lifecycle: typeof lifecycle;
  scoring: typeof scoring;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
