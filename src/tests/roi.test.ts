import { describe, it, expect } from 'vitest'
import { calculateRoiMetrics, formatFollowers, formatIDR } from '../utils/formatters'

describe('Metrik ROI & Formatter', () => {
  describe('calculateRoiMetrics', () => {
    it('harus menghitung CPM, CPE, dan CPV dengan benar untuk data normal', () => {
      // Budget: Rp 5.000.000, Views: 50.000, Engagement: 2.500
      const res = calculateRoiMetrics(5000000, 50000, 2500)
      // CPM = (5.000.000 / 50.000) * 1000 = 100.000,00
      expect(res.cpm).toBe('100000.00')
      // CPE = 5.000.000 / 2.500 = 2.000,00
      expect(res.cpe).toBe('2000.00')
      // CPV = 5.000.000 / 50.000 = 100,00
      expect(res.cpv).toBe('100.00')
    })

    it('harus mengembalikan null jika views atau engagement bernilai 0', () => {
      const res = calculateRoiMetrics(1000000, 0, 0)
      expect(res.cpm).toBeNull()
      expect(res.cpe).toBeNull()
      expect(res.cpv).toBeNull()
    })
  })

  describe('formatFollowers', () => {
    it('harus memformat angka followers ke satuan K dan M', () => {
      expect(formatFollowers(500)).toBe('500')
      expect(formatFollowers(15000)).toBe('15K')
      expect(formatFollowers(2500000)).toBe('2.5M')
      expect(formatFollowers(null)).toBe('0')
    })
  })

  describe('formatIDR', () => {
    it('harus memformat angka ke format Rupiah', () => {
      expect(formatIDR(1500000)).toContain('1.500.000')
      expect(formatIDR('500000')).toContain('500.000')
      expect(formatIDR(0)).toBe('Rp 0')
    })
  })
})
