import { createServerFn } from '@tanstack/react-start'
import { eq, and, ilike, desc } from 'drizzle-orm'
import { db } from '../db/index'
import { kols } from '../db/schema'

export interface CreateKolInput {
  name: string
  platform: string
  username?: string
  niche?: string
  followers?: number
  engagementRate?: string
  ratePerPost?: string
  contact?: string
  notes?: string
}

export const getKols = createServerFn({ method: 'GET' })
  .validator((params: {
    niche?: string
    platform?: string
    search?: string
  } = {}) => params)
  .handler(async ({ data }) => {
    try {
      const conditions = []

      if (data.niche && data.niche !== 'all') {
        conditions.push(eq(kols.niche, data.niche))
      }
      if (data.platform && data.platform !== 'all') {
        conditions.push(eq(kols.platform, data.platform))
      }
      if (data.search) {
        conditions.push(ilike(kols.name, `%${data.search}%`))
      }

      const result = await db
        .select()
        .from(kols)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(kols.createdAt))

      return result
    } catch (err) {
      console.error('Error fetching KOLs:', err)
      return []
    }
  })

export const getKolById = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const result = await db.select().from(kols).where(eq(kols.id, id)).limit(1)
      return result[0] || null
    } catch (err) {
      console.error('Error fetching KOL by id:', err)
      return null
    }
  })

export const createKol = createServerFn({ method: 'POST' })
  .validator((input: CreateKolInput) => input)
  .handler(async ({ data }) => {
    try {
      const [inserted] = await db
        .insert(kols)
        .values({
          name: data.name,
          platform: data.platform,
          username: data.username,
          niche: data.niche,
          followers: data.followers || 0,
          engagementRate: data.engagementRate,
          ratePerPost: data.ratePerPost,
          contact: data.contact,
          notes: data.notes,
        })
        .returning()
      return inserted
    } catch (err) {
      console.error('Error creating KOL:', err)
      throw new Error('Gagal menambahkan KOL')
    }
  })

export const updateKol = createServerFn({ method: 'POST' })
  .validator((input: { id: string } & Partial<CreateKolInput>) => input)
  .handler(async ({ data }) => {
    try {
      const { id, ...fields } = data
      const [updated] = await db
        .update(kols)
        .set({
          ...fields,
          updatedAt: new Date(),
        })
        .where(eq(kols.id, id))
        .returning()
      return updated
    } catch (err) {
      console.error('Error updating KOL:', err)
      throw new Error('Gagal memperbarui data KOL')
    }
  })

export const deleteKol = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      await db.delete(kols).where(eq(kols.id, id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting KOL:', err)
      throw new Error('Gagal menghapus KOL')
    }
  })
