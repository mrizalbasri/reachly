export function formatFollowers(num: number | null | undefined): string {
  if (!num) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return num.toString()
}

export function formatIDR(val: string | number | null | undefined): string {
  if (!val) return 'Rp 0'
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

export interface RoiMetrics {
  cpm: string | null
  cpe: string | null
  cpv: string | null
}

export function calculateRoiMetrics(
  budget: number,
  views: number,
  engagement: number
): RoiMetrics {
  const cpm = views > 0 ? ((budget / views) * 1000).toFixed(2) : null
  const cpe = engagement > 0 ? (budget / engagement).toFixed(2) : null
  const cpv = views > 0 ? (budget / views).toFixed(2) : null
  return { cpm, cpe, cpv }
}
