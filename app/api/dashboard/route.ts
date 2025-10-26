import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";
import { customers, serviceRecords, staff, teams } from "@/lib/db/schema";
import { sql, eq, and, gte } from "drizzle-orm";
import { getCached, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const teamMember = await db.query.teamMembers.findFirst({
      where: (teamMembers, { eq }) => eq(teamMembers.userId, user.id),
    });

    if (!teamMember) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const teamId = teamMember.teamId;

    // Get all stats with caching
    const [totalRevenue, totalCustomers, totalServiceRecords, totalStaff] =
      await Promise.all([
        // Total Revenue - sum of completed service records
        getCached(
          `dashboard_revenue_${teamId}`,
          async () => {
            const result = await db
              .select({
                total: sql<number>`COALESCE(SUM(CAST(${serviceRecords.totalCost} AS NUMERIC)), 0)`,
              })
              .from(serviceRecords)
              .where(
                and(
                  eq(serviceRecords.teamId, teamId),
                  eq(serviceRecords.status, "completed")
                )
              );
            return Number(result[0]?.total || 0);
          },
          CACHE_TTL.MEDIUM
        ),

        // Total Customers
        getCached(
          CACHE_KEYS.CUSTOMERS_COUNT(teamId),
          async () => {
            const result = await db
              .select({ count: sql<number>`count(*)` })
              .from(customers)
              .where(eq(customers.teamId, teamId));
            return Number(result[0]?.count || 0);
          },
          CACHE_TTL.MEDIUM
        ),

        // Total Service Records
        getCached(
          `service_records_count_${teamId}`,
          async () => {
            const result = await db
              .select({ count: sql<number>`count(*)` })
              .from(serviceRecords)
              .where(eq(serviceRecords.teamId, teamId));
            return Number(result[0]?.count || 0);
          },
          CACHE_TTL.MEDIUM
        ),

        // Total Staff
        getCached(
          CACHE_KEYS.STAFF_COUNT(teamId),
          async () => {
            const result = await db
              .select({ count: sql<number>`count(*)` })
              .from(staff)
              .where(eq(staff.teamId, teamId));
            return Number(result[0]?.count || 0);
          },
          CACHE_TTL.MEDIUM
        ),
      ]);

    // Get last 30 days revenue for chart
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await getCached(
      `daily_revenue_${teamId}`,
      async () => {
        const result = await db
          .select({
            date: sql<string>`DATE(${serviceRecords.createdAt})`,
            revenue: sql<number>`COALESCE(SUM(CAST(${serviceRecords.totalCost} AS NUMERIC)), 0)`,
          })
          .from(serviceRecords)
          .where(
            and(
              eq(serviceRecords.teamId, teamId),
              eq(serviceRecords.status, "completed"),
              gte(serviceRecords.createdAt, thirtyDaysAgo)
            )
          )
          .groupBy(sql`DATE(${serviceRecords.createdAt})`);

        // Generate all 30 days with 0 revenue for days without records
        const days = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date(thirtyDaysAgo);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];
          const dayRevenue = result.find((r) => r.date === dateStr);
          days.push({
            date: dateStr,
            revenue: dayRevenue ? Number(dayRevenue.revenue) : 0,
          });
        }

        return days;
      },
      CACHE_TTL.MEDIUM
    );

    // Get yearly breakup (last 12 months)
    const yearlyBreakup = await getCached(
      `yearly_breakup_${teamId}`,
      async () => {
        const result = await db
          .select({
            month: sql<string>`TO_CHAR(${serviceRecords.createdAt}, 'YYYY-MM')`,
            revenue: sql<number>`COALESCE(SUM(CAST(${serviceRecords.totalCost} AS NUMERIC)), 0)`,
          })
          .from(serviceRecords)
          .where(
            and(
              eq(serviceRecords.teamId, teamId),
              eq(serviceRecords.status, "completed"),
              gte(
                serviceRecords.createdAt,
                new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
              )
            )
          )
          .groupBy(sql`TO_CHAR(${serviceRecords.createdAt}, 'YYYY-MM')`)
          .orderBy(sql`TO_CHAR(${serviceRecords.createdAt}, 'YYYY-MM')`);

        return result.map((r) => ({
          month: r.month,
          revenue: Number(r.revenue),
        }));
      },
      CACHE_TTL.MEDIUM
    );

    // Get monthly earnings (current month)
    const monthlyEarnings = await getCached(
      `monthly_earnings_${teamId}`,
      async () => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const result = await db
          .select({
            total: sql<number>`COALESCE(SUM(CAST(${serviceRecords.totalCost} AS NUMERIC)), 0)`,
          })
          .from(serviceRecords)
          .where(
            and(
              eq(serviceRecords.teamId, teamId),
              eq(serviceRecords.status, "completed"),
              gte(serviceRecords.createdAt, firstDayOfMonth)
            )
          );
        return Number(result[0]?.total || 0);
      },
      CACHE_TTL.MEDIUM
    );

    return NextResponse.json({
      stats: {
        totalRevenue: Number(totalRevenue),
        totalCustomers: Number(totalCustomers),
        totalServiceRecords: Number(totalServiceRecords),
        totalStaff: Number(totalStaff),
      },
      chart: dailyRevenue,
      yearlyBreakup,
      monthlyEarnings: Number(monthlyEarnings),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
