import { createServerFn } from '@tanstack/react-start'
import { eq, and } from 'drizzle-orm'
import { db } from '../db/index'
import { performanceRecords, campaignKols, kols, campaigns } from '../db/schema'
import { calculateRoiMetrics } from '../utils/formatters'

export interface UpsertPerformanceInput {
  campaignKolId: string
  views?: number
  engagement?: number
  conversions?: number
}

export const upsertPerformanceRecord = createServerFn({ method: 'POST' })
  .validator((input: UpsertPerformanceInput) => input)
  .handler(async ({ data }) => {
    try {
      // 1. Get campaignKol details to calculate metrics based on allocatedBudget
      const [ck] = await db
        .select()
        .from(campaignKols)
        .where(eq(campaignKols.id, data.campaignKolId))
        .limit(1)

      if (!ck) {
        throw new Error('Alokasi KOL Kampanye tidak ditemukan')
      }

      const budget = ck.allocatedBudget ? parseFloat(ck.allocatedBudget) : 0
      const views = data.views || 0
      const engagement = data.engagement || 0
      const conversions = data.conversions || 0

      // Calculate ROI metrics via shared helper
      const { cpm, cpe, cpv } = calculateRoiMetrics(budget, views, engagement)

      const payload = { views, engagement, conversions, cpm, cpe, cpv }

      // 2. Check if a record already exists for this campaignKolId
      const [existing] = await db
        .select({ id: performanceRecords.id })
        .from(performanceRecords)
        .where(eq(performanceRecords.campaignKolId, data.campaignKolId))
        .limit(1)

      const [result] = existing
        ? await db.update(performanceRecords).set(payload).where(eq(performanceRecords.id, existing.id)).returning()
        : await db.insert(performanceRecords).values({ campaignKolId: data.campaignKolId, ...payload }).returning()

      return result
    } catch (err) {
      console.error('Error updating performance record:', err)
      throw new Error('Gagal menyimpan data performa')
    }
  })

export const getAnalyticsOverview = createServerFn({ method: 'GET' })
  .validator((params: { campaignId?: string; platform?: string } = {}) => params)
  .handler(async ({ data }) => {
    try {
      const conditions = []

      if (data.campaignId && data.campaignId !== 'all') {
        conditions.push(eq(campaignKols.campaignId, data.campaignId))
      }
      if (data.platform && data.platform !== 'all') {
        conditions.push(eq(kols.platform, data.platform))
      }

      const rows = await db
        .select({
          performanceId: performanceRecords.id,
          campaignKolId: campaignKols.id,
          campaignId: campaignKols.campaignId,
          campaignName: campaigns.name,
          kolId: kols.id,
          kolName: kols.name,
          kolPlatform: kols.platform,
          kolUsername: kols.username,
          kolNiche: kols.niche,
          allocatedBudget: campaignKols.allocatedBudget,
          status: campaignKols.status,
          views: performanceRecords.views,
          engagement: performanceRecords.engagement,
          conversions: performanceRecords.conversions,
          cpm: performanceRecords.cpm,
          cpe: performanceRecords.cpe,
          cpv: performanceRecords.cpv,
        })
        .from(campaignKols)
        .innerJoin(campaigns, eq(campaignKols.campaignId, campaigns.id))
        .innerJoin(kols, eq(campaignKols.kolId, kols.id))
        .leftJoin(performanceRecords, eq(campaignKols.id, performanceRecords.campaignKolId))
        .where(conditions.length > 0 ? and(...conditions) : undefined)

      // Compute Summary Aggregates
      let totalViews = 0
      let totalEngagement = 0
      let totalConversions = 0
      let totalBudgetAllocated = 0

      rows.forEach((row) => {
        if (row.views) totalViews += row.views
        if (row.engagement) totalEngagement += row.engagement
        if (row.conversions) totalConversions += row.conversions
        if (row.allocatedBudget) totalBudgetAllocated += parseFloat(row.allocatedBudget)
      })

      const avgCpm = totalViews > 0 ? ((totalBudgetAllocated / totalViews) * 1000).toFixed(2) : '0'
      const avgCpe = totalEngagement > 0 ? (totalBudgetAllocated / totalEngagement).toFixed(2) : '0'
      const avgCpv = totalViews > 0 ? (totalBudgetAllocated / totalViews).toFixed(2) : '0'

      return {
        rows,
        summary: {
          totalViews,
          totalEngagement,
          totalConversions,
          totalBudgetAllocated,
          avgCpm,
          avgCpe,
          avgCpv,
        },
      }
    } catch (err) {
      console.error('Error fetching analytics overview:', err)
      return {
        rows: [],
        summary: {
          totalViews: 0,
          totalEngagement: 0,
          totalConversions: 0,
          totalBudgetAllocated: 0,
          avgCpm: '0',
          avgCpe: '0',
          avgCpv: '0',
        },
      }
    }
  })
