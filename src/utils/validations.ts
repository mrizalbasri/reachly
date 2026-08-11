import { z } from 'zod'

export const kolSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama KOL wajib diisi' }),
  platform: z.string().min(1, { message: 'Platform wajib dipilih' }),
  username: z.string().optional().default(''),
  niche: z.string().optional().default(''),
  followers: z.coerce
    .number({ invalid_type_error: 'Followers harus berupa angka' })
    .int({ message: 'Followers harus berupa bilangan bulat' })
    .min(0, { message: 'Followers tidak boleh negatif' }),
  engagementRate: z.coerce
    .number({ invalid_type_error: 'Engagement rate harus berupa angka' })
    .min(0, { message: 'Engagement rate tidak boleh negatif' })
    .max(100, { message: 'Engagement rate tidak boleh lebih dari 100%' }),
  ratePerPost: z.coerce
    .number({ invalid_type_error: 'Rate card harus berupa angka' })
    .min(0, { message: 'Rate card per post tidak boleh negatif' }),
  contact: z.string().optional().default(''),
  notes: z.string().optional().default(''),
})

export type KolSchemaInput = z.infer<typeof kolSchema>

export const campaignSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Nama kampanye wajib diisi' }),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    totalBudget: z.coerce
      .number({ invalid_type_error: 'Total budget harus berupa angka' })
      .min(0, { message: 'Total budget tidak boleh negatif' }),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate)
      }
      return true
    },
    {
      message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
      path: ['endDate'],
    }
  )

export type CampaignSchemaInput = z.infer<typeof campaignSchema>

export const performanceSchema = z.object({
  campaignKolId: z.string().min(1, { message: 'ID Campaign KOL wajib diisi' }),
  views: z.coerce
    .number({ invalid_type_error: 'Views harus berupa angka' })
    .int({ message: 'Views harus berupa bilangan bulat' })
    .min(0, { message: 'Views tidak boleh negatif' }),
  engagement: z.coerce
    .number({ invalid_type_error: 'Engagement harus berupa angka' })
    .int({ message: 'Engagement harus berupa bilangan bulat' })
    .min(0, { message: 'Engagement tidak boleh negatif' }),
  conversions: z.coerce
    .number({ invalid_type_error: 'Konversi harus berupa angka' })
    .int({ message: 'Konversi harus berupa bilangan bulat' })
    .min(0, { message: 'Konversi tidak boleh negatif' }),
})

export type PerformanceSchemaInput = z.infer<typeof performanceSchema>

/**
 * Helper to classify KOL follower counts into tiers
 */
export type FollowerTier = 'all' | 'nano' | 'micro' | 'mid' | 'macro' | 'mega'

export function getFollowerTier(followers: number | null | undefined): FollowerTier {
  if (!followers || followers < 10000) return 'nano'
  if (followers < 100000) return 'micro'
  if (followers < 500000) return 'mid'
  if (followers < 1000000) return 'macro'
  return 'mega'
}

export const FOLLOWER_TIERS = [
  { id: 'all', label: 'Semua Tier' },
  { id: 'nano', label: 'Nano (<10K)' },
  { id: 'micro', label: 'Micro (10K - 100K)' },
  { id: 'mid', label: 'Mid-Tier (100K - 500K)' },
  { id: 'macro', label: 'Macro (500K - 1M)' },
  { id: 'mega', label: 'Mega (>1M)' },
] as const
