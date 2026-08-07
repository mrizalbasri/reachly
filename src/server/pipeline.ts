import { createServerFn } from '@tanstack/react-start'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db/index'
import { pipelineEntries, kols, pipelineLogs } from '../db/schema'

export type PipelineStatusType = 'prospek' | 'outreach' | 'nego' | 'deal' | 'posting' | 'selesai'

export const getPipelineEntries = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const entries = await db
      .select({
        id: pipelineEntries.id,
        kolId: pipelineEntries.kolId,
        campaignId: pipelineEntries.campaignId,
        status: pipelineEntries.status,
        notes: pipelineEntries.notes,
        deadline: pipelineEntries.deadline,
        createdAt: pipelineEntries.createdAt,
        updatedAt: pipelineEntries.updatedAt,
        kolName: kols.name,
        kolPlatform: kols.platform,
        kolUsername: kols.username,
        kolNiche: kols.niche,
        kolFollowers: kols.followers,
        kolRate: kols.ratePerPost,
        kolContact: kols.contact,
      })
      .from(pipelineEntries)
      .leftJoin(kols, eq(pipelineEntries.kolId, kols.id))
      .orderBy(desc(pipelineEntries.updatedAt))

    return entries
  } catch (err) {
    console.error('Error fetching pipeline entries:', err)
    return []
  }
})

export const createPipelineEntry = createServerFn({ method: 'POST' })
  .validator((input: { kolId: string; status?: PipelineStatusType; notes?: string }) => input)
  .handler(async ({ data }) => {
    try {
      const initialStatus = data.status || 'prospek'
      const [inserted] = await db
        .insert(pipelineEntries)
        .values({
          kolId: data.kolId,
          status: initialStatus,
          notes: data.notes || '',
        })
        .returning()

      if (inserted) {
        await db.insert(pipelineLogs).values({
          pipelineEntryId: inserted.id,
          fromStatus: null,
          toStatus: initialStatus,
          notes: data.notes ? `Entry dibuat: ${data.notes}` : 'Entry baru ditambahkan ke pipeline',
        })
      }

      return inserted
    } catch (err) {
      console.error('Error creating pipeline entry:', err)
      throw new Error('Gagal menambahkan ke pipeline')
    }
  })

export const updatePipelineStatus = createServerFn({ method: 'POST' })
  .validator((input: { id: string; status: PipelineStatusType; notes?: string }) => input)
  .handler(async ({ data }) => {
    try {
      // Get current status first for log comparison
      const [current] = await db
        .select({ status: pipelineEntries.status })
        .from(pipelineEntries)
        .where(eq(pipelineEntries.id, data.id))

      const [updated] = await db
        .update(pipelineEntries)
        .set({
          status: data.status,
          updatedAt: new Date(),
        })
        .where(eq(pipelineEntries.id, data.id))
        .returning()

      if (updated && current && current.status !== data.status) {
        await db.insert(pipelineLogs).values({
          pipelineEntryId: data.id,
          fromStatus: current.status,
          toStatus: data.status,
          notes: data.notes || `Status diubah dari ${current.status} menjadi ${data.status}`,
        })
      }

      return updated
    } catch (err) {
      console.error('Error updating pipeline status:', err)
      throw new Error('Gagal memperbarui status pipeline')
    }
  })

export const getPipelineLogs = createServerFn({ method: 'POST' })
  .validator((input: { pipelineEntryId: string }) => input)
  .handler(async ({ data }) => {
    try {
      const logs = await db
        .select()
        .from(pipelineLogs)
        .where(eq(pipelineLogs.pipelineEntryId, data.pipelineEntryId))
        .orderBy(desc(pipelineLogs.createdAt))

      return logs
    } catch (err) {
      console.error('Error fetching pipeline logs:', err)
      return []
    }
  })

export const updatePipelineNotes = createServerFn({ method: 'POST' })
  .validator((input: { id: string; notes: string }) => input)
  .handler(async ({ data }) => {
    try {
      const [updated] = await db
        .update(pipelineEntries)
        .set({
          notes: data.notes,
          updatedAt: new Date(),
        })
        .where(eq(pipelineEntries.id, data.id))
        .returning()
      return updated
    } catch (err) {
      console.error('Error updating pipeline notes:', err)
      throw new Error('Gagal memperbarui catatan')
    }
  })

export const deletePipelineEntry = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(pipelineEntries).where(eq(pipelineEntries.id, id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting pipeline entry:', err)
      throw new Error('Gagal menghapus entry pipeline')
    }
  })

export const updatePipelineDeadline = createServerFn({ method: 'POST' })
  .validator((input: { id: string; deadline: string | null }) => input)
  .handler(async ({ data }) => {
    try {
      const [updated] = await db
        .update(pipelineEntries)
        .set({
          deadline: data.deadline ? new Date(data.deadline) : null,
          updatedAt: new Date(),
        })
        .where(eq(pipelineEntries.id, data.id))
        .returning()
      return updated
    } catch (err) {
      console.error('Error updating pipeline deadline:', err)
      throw new Error('Gagal memperbarui deadline')
    }
  })

