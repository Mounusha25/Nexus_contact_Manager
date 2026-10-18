import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

type AuthenticatedContext = Pick<MutationCtx | QueryCtx, "auth" | "db">;

export type CurrentAccount = {
  actorClerkUserId: string;
  user: Doc<"users">;
};

export async function requireCurrentAccount(
  ctx: AuthenticatedContext
): Promise<CurrentAccount> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (query) =>
      query.eq("clerkUserId", identity.subject)
    )
    .unique();

  if (!user) throw new Error("User not found");

  return { actorClerkUserId: identity.subject, user };
}

export function requireOwnership(
  currentUserId: Id<"users">,
  resourceUserId: Id<"users">
): void {
  if (currentUserId !== resourceUserId) {
    // Avoid confirming that another account's resource exists.
    throw new Error("Resource not found");
  }
}
