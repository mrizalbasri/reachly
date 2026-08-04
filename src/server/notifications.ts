import { createServerFn } from '@tanstack/react-start'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db/index'
import { pipelineEntries, kols, campaigns } from '../db/schema'

export interface NotificationAlert {
  id: string
  type: 'urgent' | 'warning'
  title: string
  message: string
  kolName: string
  kolPlatform: string
  campaignName?: string
  date?: string
  link: string
}

export const getNotificationAlerts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const now = new Date()
    const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch pipeline entries joined with KOLs and Campaigns
    const entries = await db
      .select({
        id: pipelineEntries.id,
        kolId: pipelineEntries.kolId,
        kolName: kols.name,
        kolPlatform: kols.platform,
        campaignId: pipelineEntries.campaignId,
        campaignName: campaigns.name,
        status: pipelineEntries.status,
        deadline: pipelineEntries.deadline,
        updatedAt: pipelineEntries.updatedAt,
      })
      .from(pipelineEntries)
      .innerJoin(kols, eq(pipelineEntries.kolId, kols.id))
      .leftJoin(campaigns, eq(pipelineEntries.campaignId, campaigns.id))
      .orderBy(desc(pipelineEntries.updatedAt))

    const alerts: NotificationAlert[] = []

    entries.forEach((entry) => {
      // Rule 1: Deadline Alert (Deadline <= 48 hours or Overdue, status != 'selesai')
      if (entry.deadline && entry.status !== 'selesai') {
        const deadlineDate = new Date(entry.deadline)
        if (deadlineDate <= twoDaysFromNow) {
          const isOverdue = deadlineDate < now
          alerts.push({
            id: `deadline-${entry.id}`,
            type: 'urgent',
            title: isOverdue ? 'Tenggat Waktu Lewat!' : 'Tenggat Waktu Dekat!',
            message: `${entry.kolName} (${entry.status}) — Batas waktu: ${deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`,
            kolName: entry.kolName,
            kolPlatform: entry.kolPlatform,
            campaignName: entry.campaignName || undefined,
            date: deadlineDate.toISOString(),
            link: '/pipeline',
          })
        }
      }

      // Rule 2: Stale Outreach Alert (Status = 'outreach' or 'prospek' & updatedAt > 7 days ago)
      if ((entry.status === 'outreach' || entry.status === 'prospek') && entry.updatedAt) {
        const lastUpdate = new Date(entry.updatedAt)
        if (lastUpdate <= sevenDaysAgo) {
          const daysStale = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
          alerts.push({
            id: `stale-${entry.id}`,
            type: 'warning',
            title: 'Negosiasi Menggantung',
            message: `${entry.kolName} di kolom ${entry.status} belum ada update selama ${daysStale} hari.`,
            kolName: entry.kolName,
            kolPlatform: entry.kolPlatform,
            campaignName: entry.campaignName || undefined,
            date: lastUpdate.toISOString(),
            link: '/pipeline',
          })
        }
      }
    })

    return {
      alerts,
      unreadCount: alerts.length,
    }
  } catch (err) {
    console.error('Error fetching notification alerts:', err)
    return {
      alerts: [],
      unreadCount: 0,
    }
  }
})
