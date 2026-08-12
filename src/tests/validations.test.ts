import { describe, it, expect } from 'vitest'
import {
  kolSchema,
  campaignSchema,
  performanceSchema,
} from '../utils/validations'

describe('Validasi Skema Form Zod', () => {
  describe('kolSchema', () => {
    it('harus berhasil jika data KOL valid', () => {
      const validKol = {
        name: 'Jerome Polin',
        platform: 'YouTube',
        username: '@jeromepolin',
        niche: 'Education',
        followers: 1000000,
        engagementRate: '5.2',
        ratePerPost: '15000000',
        contact: 'manager@jerome.com',
        notes: 'Gaya konten edukasi seru',
      }
      const result = kolSchema.safeParse(validKol)
      expect(result.success).toBe(true)
    })

    it('harus menolak jika nama KOL kosong', () => {
      const invalidKol = {
        name: '   ',
        platform: 'Instagram',
        followers: 1000,
        engagementRate: 2.5,
        ratePerPost: 500000,
      }
      const result = kolSchema.safeParse(invalidKol)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nama KOL wajib diisi')
      }
    })

    it('harus menolak jika followers bernilai negatif', () => {
      const invalidKol = {
        name: 'Raffi Ahmad',
        platform: 'Instagram',
        followers: -500,
        engagementRate: 3.1,
        ratePerPost: 10000000,
      }
      const result = kolSchema.safeParse(invalidKol)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Followers tidak boleh negatif')
      }
    })

    it('harus menolak jika rate card bernilai negatif', () => {
      const invalidKol = {
        name: 'Atta Halilintar',
        platform: 'YouTube',
        followers: 1000000,
        engagementRate: 4.0,
        ratePerPost: -1000000,
      }
      const result = kolSchema.safeParse(invalidKol)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Rate card per post tidak boleh negatif')
      }
    })
  })

  describe('campaignSchema', () => {
    it('harus berhasil jika data kampanye valid', () => {
      const validCampaign = {
        name: 'Promo Q3 Skincare',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        totalBudget: '50000000',
      }
      const result = campaignSchema.safeParse(validCampaign)
      expect(result.success).toBe(true)
    })

    it('harus menolak jika budget bernilai negatif', () => {
      const invalidCampaign = {
        name: 'Campaign Rugi',
        totalBudget: '-50000',
      }
      const result = campaignSchema.safeParse(invalidCampaign)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Total budget tidak boleh negatif')
      }
    })

    it('harus menolak jika tanggal selesai lebih awal dari tanggal mulai', () => {
      const invalidDates = {
        name: 'Campaign Salah Tanggal',
        startDate: '2026-10-15',
        endDate: '2026-10-01',
        totalBudget: 1000000,
      }
      const result = campaignSchema.safeParse(invalidDates)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Tanggal selesai tidak boleh lebih awal dari tanggal mulai')
      }
    })
  })

  describe('performanceSchema', () => {
    it('harus berhasil jika metrics performa valid', () => {
      const validPerf = {
        campaignKolId: 'abc-123',
        views: 25000,
        engagement: 1200,
        conversions: 85,
      }
      const result = performanceSchema.safeParse(validPerf)
      expect(result.success).toBe(true)
    })

    it('harus menolak jika views bernilai negatif', () => {
      const invalidPerf = {
        campaignKolId: 'abc-123',
        views: -100,
        engagement: 50,
        conversions: 5,
      }
      const result = performanceSchema.safeParse(invalidPerf)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Views tidak boleh negatif')
      }
    })
  })
})
