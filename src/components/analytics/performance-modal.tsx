import { useState, useEffect } from 'react'
import { Dialog } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { upsertPerformanceRecord } from '../../server/analytics'
import { useToast } from '../ui/toast'
import { Eye, ThumbsUp, ShoppingBag } from 'lucide-react'
import { performanceSchema } from '../../utils/validations'

interface PerformanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  item: {
    campaignKolId: string
    kolName: string
    campaignName?: string
    views?: number | null
    engagement?: number | null
    conversions?: number | null
  } | null
}

export function PerformanceModal({ isOpen, onClose, onSuccess, item }: PerformanceModalProps) {
  const toast = useToast()
  const [views, setViews] = useState('')
  const [engagement, setEngagement] = useState('')
  const [conversions, setConversions] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (item) {
      setViews(item.views != null ? String(item.views) : '')
      setEngagement(item.engagement != null ? String(item.engagement) : '')
      setConversions(item.conversions != null ? String(item.conversions) : '')
    } else {
      setViews('')
      setEngagement('')
      setConversions('')
    }
    setError('')
  }, [item, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item?.campaignKolId) return

    const payload = {
      campaignKolId: item.campaignKolId,
      views: views ? parseInt(views, 10) : 0,
      engagement: engagement ? parseInt(engagement, 10) : 0,
      conversions: conversions ? parseInt(conversions, 10) : 0,
    }

    const validationResult = performanceSchema.safeParse(payload)
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || 'Validasi performa gagal'
      setError(firstIssue)
      toast.warning('Validasi Form', firstIssue)
      return
    }

    setLoading(true)
    setError('')

    try {
      await upsertPerformanceRecord({
        data: payload,
      })

      toast.success('Performa Diperbarui', `Data performa untuk ${item.kolName} berhasil disimpan.`)
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      const msg = err?.message || 'Gagal menyimpan data performa'
      setError(msg)
      toast.error('Gagal Menyimpan', msg)
    } finally {
      setLoading(false)
    }
  }


  if (!item) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Input Performa — ${item.kolName}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {item.campaignName && (
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100/80 text-xs text-[#7C3AED] flex items-center justify-between">
            <span className="font-medium">Kampanye:</span>
            <span className="font-bold">{item.campaignName}</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* Input Views */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1E] mb-1 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />
            Jumlah Views / Impressions
          </label>
          <Input
            type="number"
            min="0"
            placeholder="Contoh: 50000"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
          <p className="text-[10px] text-[#8E8E93] mt-1">Total impresi atau tayangan postingan KOL.</p>
        </div>

        {/* Input Engagement */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1E] mb-1 flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-[#EC4899]" />
            Jumlah Engagement (Likes, Comments, Shares)
          </label>
          <Input
            type="number"
            min="0"
            placeholder="Contoh: 2500"
            value={engagement}
            onChange={(e) => setEngagement(e.target.value)}
          />
          <p className="text-[10px] text-[#8E8E93] mt-1">Total interaksi penonton pada postingan.</p>
        </div>

        {/* Input Conversions */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1E] mb-1 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-[#10B981]" />
            Jumlah Konversi / Pembelian (Opsional)
          </label>
          <Input
            type="number"
            min="0"
            placeholder="Contoh: 150"
            value={conversions}
            onChange={(e) => setConversions(e.target.value)}
          />
          <p className="text-[10px] text-[#8E8E93] mt-1">Jumlah transaksi atau lead yang dihasilkan.</p>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEEEF0] mt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
            {loading ? 'Menyimpan...' : 'Simpan Data Performa'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
