import { createServerFn } from '@tanstack/react-start'
import { eq, and, sql, desc, asc, gte, or, isNull } from 'drizzle-orm'
import { db } from '../db/index'
import { campaigns, campaignKols, kols, pipelineEntries } from '../db/schema'

export const getDashboardStats = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const now = new Date()

    // 1. Total KOL
    const [{ count: totalKols }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(kols)

    // 2. Active Campaigns Count (endDate is in future or null)
    const [{ count: activeCampaignsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(campaigns)
      .where(or(isNull(campaigns.endDate), gte(campaigns.endDate, now)))

    // 3. Total Budget Allocated (sum of campaign_kols.allocated_budget)
    const [{ sum: totalBudgetAllocated }] = await db
      .select({ sum: sql<string>`coalesce(sum(${campaignKols.allocatedBudget}), 0)::text` })
      .from(campaignKols)

    // 4. Total Campaigns Budget (sum of campaigns.total_budget)
    const [{ sum: totalCampaignsBudget }] = await db
      .select({ sum: sql<string>`coalesce(sum(${campaigns.totalBudget}), 0)::text` })
      .from(campaigns)

    // 5. Soonest Deadlines (pipeline entries with deadlines, ordered by deadline asc)
    const soonestDeadlines = await db
      .select({
        id: pipelineEntries.id,
        status: pipelineEntries.status,
        deadline: pipelineEntries.deadline,
        notes: pipelineEntries.notes,
        kolName: kols.name,
        kolPlatform: kols.platform,
        kolUsername: kols.username,
        campaignName: campaigns.name,
      })
      .from(pipelineEntries)
      .innerJoin(kols, eq(pipelineEntries.kolId, kols.id))
      .leftJoin(campaigns, eq(pipelineEntries.campaignId, campaigns.id))
      .where(and(sql`${pipelineEntries.deadline} is not null`, sql`${pipelineEntries.status} != 'selesai'`))
      .orderBy(asc(pipelineEntries.deadline))
      .limit(5)

    // 6. Active Campaigns Details
    const activeCampaigns = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        totalBudget: campaigns.totalBudget,
        kolCount: sql<number>`count(${campaignKols.kolId})::int`,
        allocatedBudgetSum: sql<string>`coalesce(sum(${campaignKols.allocatedBudget}), 0)::text`,
      })
      .from(campaigns)
      .leftJoin(campaignKols, eq(campaigns.id, campaignKols.campaignId))
      .where(or(isNull(campaigns.endDate), gte(campaigns.endDate, now)))
      .groupBy(campaigns.id)
      .orderBy(desc(campaigns.createdAt))
      .limit(5)

    return {
      totalKols,
      activeCampaignsCount,
      totalBudgetAllocated,
      totalCampaignsBudget,
      soonestDeadlines,
      activeCampaigns,
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err)
    return {
      totalKols: 0,
      activeCampaignsCount: 0,
      totalBudgetAllocated: '0',
      totalCampaignsBudget: '0',
      soonestDeadlines: [],
      activeCampaigns: [],
    }
  }
})
