import { describe, it, expect } from 'vitest'
import { getFollowerTier, FOLLOWER_TIERS } from '../utils/validations'

describe('Klasifikasi & Filter Tier Followers', () => {
  it('harus mengelompokkan Nano (< 10K)', () => {
    expect(getFollowerTier(500)).toBe('nano')
    expect(getFollowerTier(9999)).toBe('nano')
    expect(getFollowerTier(null)).toBe('nano')
  })

  it('harus mengelompokkan Micro (10K - 100K)', () => {
    expect(getFollowerTier(10000)).toBe('micro')
    expect(getFollowerTier(50000)).toBe('micro')
    expect(getFollowerTier(99999)).toBe('micro')
  })

  it('harus mengelompokkan Mid-Tier (100K - 500K)', () => {
    expect(getFollowerTier(100000)).toBe('mid')
    expect(getFollowerTier(350000)).toBe('mid')
    expect(getFollowerTier(499999)).toBe('mid')
  })

  it('harus mengelompokkan Macro (500K - 1M)', () => {
    expect(getFollowerTier(500000)).toBe('macro')
    expect(getFollowerTier(750000)).toBe('macro')
    expect(getFollowerTier(999999)).toBe('macro')
  })

  it('harus mengelompokkan Mega (> 1M)', () => {
    expect(getFollowerTier(1000000)).toBe('mega')
    expect(getFollowerTier(5000000)).toBe('mega')
  })

  it('harus memiliki daftar opsi tier lengkap', () => {
    expect(FOLLOWER_TIERS.length).toBe(6)
    expect(FOLLOWER_TIERS.map((t) => t.id)).toEqual(['all', 'nano', 'micro', 'mid', 'macro', 'mega'])
  })
})
