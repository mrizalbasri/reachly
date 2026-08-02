import { createServerFn } from '@tanstack/react-start'
import { eq, and, sql, desc } from 'drizzle-orm'
import { db } from '../db/index'
import { campaigns, campaignKols, kols, pipelineEntries } from '../db/schema'

export const getCampaigns = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        totalBudget: campaigns.totalBudget,
        createdAt: campaigns.createdAt,
        kolCount: sql<number>`count(${campaignKols.kolId})::int`,
        allocatedBudgetSum: sql<string>`coalesce(sum(${campaignKols.allocatedBudget}), 0)::text`,
      })
      .from(campaigns)
      .leftJoin(campaignKols, eq(campaigns.id, campaignKols.campaignId))
      .groupBy(campaigns.id)
      .orderBy(desc(campaigns.createdAt))
    return result
  } catch (err) {
    console.error('Error fetching campaigns:', err)
    return []
  }
})

export const getCampaignById = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1)
      return result[0] || null
    } catch (err) {
      console.error('Error fetching campaign by id:', err)
      return null
    }
  })

export const createCampaign = createServerFn({ method: 'POST' })
  .validator((input: { name: string; startDate?: string | null; endDate?: string | null; totalBudget?: string }) => input)
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db
        .insert(campaigns)
        .values({
          name: data.name,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          totalBudget: data.totalBudget || '0',
        })
        .returning()
      return inserted
    } catch (err) {
      console.error('Error creating campaign:', err)
      throw new Error('Gagal menambahkan kampanye')
    }
  })

export const deleteCampaign = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(campaignKols).where(eq(campaignKols.campaignId, id))
      await db.update(pipelineEntries).set({ campaignId: null }).where(eq(pipelineEntries.campaignId, id))
      await db.delete(campaigns).where(eq(campaigns.id, id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting campaign:', err)
      throw new Error('Gagal menghapus kampanye')
    }
  })

export const getCampaignKols = createServerFn({ method: 'GET' })
  .validator((campaignId: string) => campaignId)
  .handler(async ({ data: campaignId }) => {
    try {
      const result = await db
        .select({
          id: campaignKols.id,
          campaignId: campaignKols.campaignId,
          kolId: campaignKols.kolId,
          allocatedBudget: campaignKols.allocatedBudget,
          status: campaignKols.status,
          createdAt: campaignKols.createdAt,
          kolName: kols.name,
          kolPlatform: kols.platform,
          kolUsername: kols.username,
          kolFollowers: kols.followers,
          kolRate: kols.ratePerPost,
        })
        .from(campaignKols)
        .innerJoin(kols, eq(campaignKols.kolId, kols.id))
        .where(eq(campaignKols.campaignId, campaignId))
      return result
    } catch (err) {
      console.error('Error fetching campaign KOLs:', err)
      return []
    }
  })

export const allocateKolToCampaign = createServerFn({ method: 'POST' })
  .validator((input: { campaignId: string; kolId: string; allocatedBudget?: string }) => input)
  .handler(async ({ data }) => {
    try {
      const existing = await db
        .select()
        .from(campaignKols)
        .where(and(eq(campaignKols.campaignId, data.campaignId), eq(campaignKols.kolId, data.kolId)))
        .limit(1)

      if (existing.length > 0) {
        const [updated] = await db
          .update(campaignKols)
          .set({ allocatedBudget: data.allocatedBudget || '0' })
          .where(eq(campaignKols.id, existing[0].id))
          .returning()
        return updated
      }

      const [inserted] = await db
        .insert(campaignKols)
        .values({
          campaignId: data.campaignId,
          kolId: data.kolId,
          allocatedBudget: data.allocatedBudget || '0',
          status: 'prospek',
        })
        .returning()

      const existingPipeline = await db
        .select()
        .from(pipelineEntries)
        .where(eq(pipelineEntries.kolId, data.kolId))
        .limit(1)

      if (existingPipeline.length > 0) {
        await db
          .update(pipelineEntries)
          .set({ campaignId: data.campaignId, updatedAt: new Date() })
          .where(eq(pipelineEntries.id, existingPipeline[0].id))
      } else {
        await db.insert(pipelineEntries).values({
          kolId: data.kolId,
          campaignId: data.campaignId,
          status: 'prospek',
        })
      }

      return inserted
    } catch (err) {
      console.error('Error allocating KOL to campaign:', err)
      throw new Error('Gagal mengalokasikan KOL ke kampanye')
    }
  })

export const removeKolFromCampaign = createServerFn({ method: 'POST' })
  .validator((input: { campaignId: string; kolId: string }) => input)
  .handler(async ({ data }) => {
    try {
      await db
        .delete(campaignKols)
        .where(and(eq(campaignKols.campaignId, data.campaignId), eq(campaignKols.kolId, data.kolId)))

      await db
        .update(pipelineEntries)
        .set({ campaignId: null, updatedAt: new Date() })
        .where(and(eq(pipelineEntries.kolId, data.kolId), eq(pipelineEntries.campaignId, data.campaignId)))

      return { success: true }
    } catch (err) {
      console.error('Error removing KOL from campaign:', err)
      throw new Error('Gagal menghapus KOL dari kampanye')
    }
  })
