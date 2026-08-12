import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Megaphone, Calendar, Trash2, Eye } from 'lucide-react'
import { getCampaigns, createCampaign, deleteCampaign } from '../../server/campaigns'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Dialog } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { useToast } from '../../components/ui/toast'
import { campaignSchema } from '../../utils/validations'

export const Route = createFileRoute('/campaigns/')({
  component: CampaignsPage,
})


function formatIDR(val: string | number | null | undefined): string {
  if (!val) return 'Rp 0'
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

function CampaignsPage() {
  const toast = useToast()
  const [campaignsList, setCampaignsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalBudget, setTotalBudget] = useState('')

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const data = await getCampaigns()
      setCampaignsList(data)
    } catch (err) {
      console.error(err)
      toast.error('Gagal Memuat Kampanye', 'Terjadi kesalahan saat mengambil daftar kampanye.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationResult = campaignSchema.safeParse({
      name,
      startDate: startDate || null,
      endDate: endDate || null,
      totalBudget: totalBudget || '0',
    })

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0]?.message || 'Validasi kampanye gagal'
      toast.warning('Validasi Form', firstIssue)
      return
    }

    try {
      await createCampaign({
        data: {
          name,
          startDate: startDate || null,
          endDate: endDate || null,
          totalBudget: totalBudget || '0',
        },
      })
      toast.success('Kampanye Dibuat', `Kampanye "${name}" berhasil dibuat.`)
      // Reset form
      setName('')
      setStartDate('')
      setEndDate('')
      setTotalBudget('')
      setIsOpen(false)
      fetchCampaigns()
    } catch (err) {
      console.error(err)
      toast.error('Gagal Membuat Kampanye', 'Terjadi kesalahan saat menyimpan kampanye baru.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kampanye ini? Seluruh data alokasi KOL juga akan terhapus.')) return
    try {
      await deleteCampaign({ data: id })
      toast.info('Kampanye Dihapus', 'Kampanye berhasil dihapus.')
      fetchCampaigns()
    } catch (err) {
      console.error(err)
      toast.error('Gagal Menghapus Kampanye', 'Tidak dapat menghapus kampanye.')
    }
  }


  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#7C3AED]" />
            Manajemen Kampanye
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1">
            Buat kampanye baru, alokasikan KOL, dan pantau pengeluaran anggaran secara real-time.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="self-start md:self-auto shadow-sm">
          <Plus className="w-4 h-4" />
          Buat Kampanye Baru
        </Button>
      </div>

      {/* Campaigns Listing */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#8E8E93]">Memuat data kampanye...</div>
      ) : campaignsList.length === 0 ? (
        <Card className="py-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-sm text-[#1C1C1E]">Belum Ada Kampanye</h3>
          <p className="text-xs text-[#8E8E93] max-w-sm">
            Buat kampanye promosi pertama Anda untuk mulai mengelola kolaborasi KOL dan anggarannya.
          </p>
          <Button onClick={() => setIsOpen(true)} size="sm">
            <Plus className="w-3.5 h-3.5" />
            Buat Kampanye Pertama
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaignsList.map((camp) => {
            const total = parseFloat(camp.totalBudget || '0')
            const allocated = parseFloat(camp.allocatedBudgetSum || '0')
            const remaining = Math.max(0, total - allocated)
            const percent = total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0

            return (
              <Card key={camp.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all duration-150 relative group">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-bold text-sm text-[#1C1C1E] tracking-tight limit-lines-1">
                      {camp.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link to="/campaigns/$campaignId" params={{ campaignId: camp.id }}>
                        <Button size="sm" variant="outline" className="w-7 h-7 p-0" title="Detail Kampanye">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(camp.id)}
                        className="w-7 h-7 p-0 hover:text-rose-500 hover:border-rose-100"
                        title="Hapus Kampanye"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-[10px] text-[#8E8E93] mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {camp.startDate ? new Date(camp.startDate).toLocaleDateString('id-ID') : 'N/A'} -{' '}
                      {camp.endDate ? new Date(camp.endDate).toLocaleDateString('id-ID') : 'N/A'}
                    </span>
                  </div>

                  {/* Stats details */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#EEEEF0] mb-4">
                    <div>
                      <span className="text-[10px] text-[#8E8E93] block">Total Budget</span>
                      <strong className="text-gray-800 font-semibold">{formatIDR(total)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8E8E93] block">KOL Terlibat</span>
                      <strong className="text-gray-800 font-semibold">{camp.kolCount} Orang</strong>
                    </div>
                  </div>
                </div>

                {/* Progress bar and details */}
                <div className="space-y-2 pt-3 border-t border-[#EEEEF0] bg-gray-50/40 p-3 rounded-xl">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#8E8E93]">Teralokasi: <strong className="text-[#7C3AED]">{formatIDR(allocated)}</strong></span>
                    <span className="text-emerald-600 font-medium">Sisa: {formatIDR(remaining)}</span>
                  </div>
                  <div className="w-full bg-[#EEEEF0] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${percent > 90 ? 'bg-amber-500' : 'bg-gradient-to-r from-[#EC4899] to-[#7C3AED]'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-right text-[9px] text-[#8E8E93]">
                    {percent}% Terpakai
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog Pembuatan Kampanye */}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Buat Kampanye Baru">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1C1C1E]">Nama Kampanye</label>
            <Input
              type="text"
              placeholder="Contoh: Mega Sale Brand Day 8.8"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1C1C1E]">Tanggal Mulai</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1C1C1E]">Tanggal Selesai</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1C1C1E]">Total Budget Kampanye (IDR)</label>
            <Input
              type="number"
              placeholder="Contoh: 50000000"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEEEF0] mt-2">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Buat Kampanye</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
