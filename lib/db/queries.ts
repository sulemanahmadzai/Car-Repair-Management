import { desc, and, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import { activityLogs, teamMembers, teams, users } from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import { getCached, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  // Cache user data for the session duration
  const userId = sessionData.user.id;
  const user = await getCached(
    CACHE_KEYS.USER(userId),
    async () => {
      const result = await db
        .select()
        .from(users)
        .where(and(eq(users.id, userId), isNull(users.deletedAt)))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      return result[0];
    },
    CACHE_TTL.USER_SESSION // 30 minutes cache for user session
  );

  return user;
}

// STRIPE QUERY FUNCTIONS COMMENTED OUT - TO BE ENABLED LATER
/*
export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}
*/

export async function getUserWithTeam(userId: number) {
  return await getCached(
    CACHE_KEYS.USER_WITH_TEAM(userId),
    async () => {
      const result = await db
        .select({
          user: users,
          teamId: teamMembers.teamId,
        })
        .from(users)
        .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
        .where(eq(users.id, userId))
        .limit(1);

      return result[0];
    },
    CACHE_TTL.USER_SESSION
  );
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await getCached(
    CACHE_KEYS.ACTIVITY_LOGS(user.id),
    async () => {
      return await db
        .select({
          id: activityLogs.id,
          action: activityLogs.action,
          timestamp: activityLogs.timestamp,
          ipAddress: activityLogs.ipAddress,
          userName: users.name,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.userId, users.id))
        .where(eq(activityLogs.userId, user.id))
        .orderBy(desc(activityLogs.timestamp))
        .limit(10);
    },
    CACHE_TTL.SHORT // Activity logs should be relatively fresh
  );
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.team || null;
}
