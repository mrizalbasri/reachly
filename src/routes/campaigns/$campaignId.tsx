import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, DollarSign, Users, Plus, Trash2, BarChart2, Download, Printer, FileSpreadsheet } from 'lucide-react'
import { getCampaignById, getCampaignKols, allocateKolToCampaign, removeKolFromCampaign } from '../../server/campaigns'
import { getKols } from '../../server/kol'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Dialog } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { PerformanceModal } from '../../components/analytics/performance-modal'
import { formatFollowers, formatIDR } from '../../utils/formatters'
import { downloadCSV, downloadExcel, printPDFReport } from '../../utils/export'
import { useToast } from '../../components/ui/toast'

export const Route = createFileRoute('/campaigns/$campaignId')({
  component: CampaignDetailPage,
})

function CampaignDetailPage() {
  const toast = useToast()
  const { campaignId } = Route.useParams()
  
  const [campaign, setCampaign] = useState<any>(null)
  const [campaignKolsList, setCampaignKolsList] = useState<any[]>([])
  const [availableKols, setAvailableKols] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State Alokasi
  const [isOpen, setIsOpen] = useState(false)
  const [selectedKolId, setSelectedKolId] = useState('')
  const [allocatedBudget, setAllocatedBudget] = useState('')

  // Modal State Performa
  const [isPerfModalOpen, setIsPerfModalOpen] = useState(false)
  const [perfItem, setPerfItem] = useState<any>(null)

  const handleOpenPerfModal = (kol: any) => {
    setPerfItem({
      campaignKolId: kol.campaignKolId,
      kolName: kol.kolName,
      campaignName: campaign?.name,
      views: kol.views,
      engagement: kol.engagement,
      conversions: kol.conversions,
    })
    setIsPerfModalOpen(true)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [cData, ckData, kData] = await Promise.all([
        getCampaignById({ data: campaignId }),
        getCampaignKols({ data: campaignId }),
        getKols({ data: {} }),
      ])
      setCampaign(cData)
      setCampaignKolsList(ckData)

      // Filter out already allocated KOLs
      const allocatedIds = new Set(ckData.map((ck: any) => ck.kolId))
      setAvailableKols(kData.filter((k: any) => !allocatedIds.has(k.id)))
    } catch (err) {
      console.error(err)
      toast.error('Gagal Memuat Data', 'Tidak dapat mengambil detail kampanye.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [campaignId])

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedKolId) {
      toast.warning('Validasi Form', 'Silakan pilih KOL.')
      return
    }

    try {
      await allocateKolToCampaign({
        data: {
          campaignId,
          kolId: selectedKolId,
          allocatedBudget: allocatedBudget || '0',
        },
      })
      toast.success('KOL Dialokasikan', 'Berhasil menambahkan KOL ke dalam kampanye.')
      setIsOpen(false)
      setSelectedKolId('')
      setAllocatedBudget('')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Gagal Alokasi', 'Terjadi kesalahan saat mengalokasikan KOL.')
    }
  }

  const handleRemove = async (kolId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus KOL dari kampanye ini?')) return
    try {
      await removeKolFromCampaign({
        data: { campaignId, kolId },
      })
      toast.info('Alokasi Dihapus', 'KOL telah dihapus dari kampanye ini.')
      loadData()
    } catch (err) {
      console.error(err)
      toast.error('Gagal Menghapus', 'Tidak dapat menghapus KOL dari kampanye.')
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#8E8E93]">Memuat detail kampanye...</div>
  }

  if (!campaign) {
    return (
      <div className="py-16 text-center flex flex-col items-center gap-3">
        <h3 className="text-base font-bold text-[#1C1C1E]">Kampanye Tidak Ditemukan</h3>
        <Link to="/campaigns">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Kampanye
          </Button>
        </Link>
      </div>
    )
  }

  const total = parseFloat(campaign.totalBudget || '0')
  const allocated = campaignKolsList.reduce((acc, k) => acc + parseFloat(k.allocatedBudget || '0'), 0)
  const remaining = Math.max(0, total - allocated)
  const percent = total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0

  const handleExportCampaign = () => {
    if (!campaignKolsList.length) return
    const headers = ['Nama KOL', 'Platform', 'Username', 'Followers', 'Rate Card (IDR)', 'Budget Teralokasi (IDR)', 'Status']
    const exportRows = campaignKolsList.map((k) => [
      k.kolName || '',
      k.kolPlatform || '',
      k.kolUsername || '',
      k.kolFollowers || 0,
      k.kolRate || '0',
      k.allocatedBudget || '0',
      k.status || 'prospek',
    ])
    const cleanName = (campaign.name || 'kampanye').replace(/\s+/g, '_')
    downloadCSV(`alokasi_kol_${cleanName}_${new Date().toISOString().slice(0, 10)}.csv`, headers, exportRows)
    toast.success('Ekspor CSV Berhasil', 'File CSV alokasi KOL telah diunduh.')
  }

  const handleExportCampaignExcel = () => {
    if (!campaignKolsList.length) return
    const headers = ['Nama KOL', 'Platform', 'Username', 'Followers', 'Rate Card (IDR)', 'Budget Teralokasi (IDR)', 'Status']
    const exportRows = campaignKolsList.map((k) => [
      k.kolName || '',
      k.kolPlatform || '',
      k.kolUsername ? `@${k.kolUsername}` : '',
      k.kolFollowers || 0,
      formatIDR(k.kolRate || 0),
      formatIDR(k.allocatedBudget || 0),
      k.status || 'prospek',
    ])
    const summaryCards = [
      { label: 'Nama Kampanye', value: campaign.name },
      { label: 'Total Budget', value: formatIDR(total) },
      { label: 'Budget Teralokasi', value: formatIDR(allocated) },
      { label: 'Sisa Budget', value: formatIDR(remaining) },
      { label: 'Jumlah KOL', value: campaignKolsList.length },
    ]
    const cleanName = (campaign.name || 'kampanye').replace(/\s+/g, '_')
    downloadExcel(
      `alokasi_kol_${cleanName}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      'Alokasi KOL',
      headers,
      exportRows,
      summaryCards
    )
    toast.success('Ekspor Excel Berhasil', 'File Excel (.xlsx) alokasi kampanye telah diunduh.')
  }

  const handleExportCampaignPDF = () => {
    if (!campaignKolsList.length) return
    const headers = ['Nama KOL', 'Platform', 'Username', 'Followers', 'Rate Card (IDR)', 'Budget Teralokasi', 'Status']
    const exportRows = campaignKolsList.map((k) => [
      k.kolName || '',
      k.kolPlatform || '',
      k.kolUsername ? `@${k.kolUsername}` : '-',
      formatFollowers(k.kolFollowers),
      formatIDR(k.kolRate || 0),
      formatIDR(k.allocatedBudget || 0),
      (k.status || 'prospek').toUpperCase(),
    ])

    const summaryCards = [
      { label: 'Total Budget', value: formatIDR(total) },
      { label: 'Teralokasi', value: formatIDR(allocated) },
      { label: 'Sisa Budget', value: formatIDR(remaining) },
      { label: 'KOL Dialokasikan', value: campaignKolsList.length },
    ]

    printPDFReport(
      `Laporan Alokasi Kampanye — ${campaign.name}`,
      'Ringkasan alokasi budget dan status kerja sama KOL',
      headers,
      exportRows,
      summaryCards
    )
    toast.info('Menyiapkan Cetak PDF', 'Jendela laporan cetak/PDF telah dibuka.')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link to="/campaigns" className="inline-flex items-center gap-1.5 text-xs text-[#8E8E93] hover:text-[#1C1C1E] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Kampanye</span>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleExportCampaign}
            variant="outline"
            size="sm"
            disabled={campaignKolsList.length === 0}
            className="text-xs text-[#7C3AED] border-purple-200 hover:bg-purple-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            CSV
          </Button>
          <Button
            onClick={handleExportCampaignExcel}
            variant="outline"
            size="sm"
            disabled={campaignKolsList.length === 0}
            className="text-xs text-emerald-700 bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/80 font-medium shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Excel (.xlsx)
          </Button>
          <Button
            onClick={handleExportCampaignPDF}
            variant="outline"
            size="sm"
            disabled={campaignKolsList.length === 0}
            className="text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/70 font-medium shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1" />
            Cetak PDF
          </Button>
          <Button onClick={() => setIsOpen(true)} size="sm">
            <Plus className="w-3.5 h-3.5" />
            Alokasikan KOL Baru
          </Button>
        </div>
      </div>


      {/* Main Campaign details */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">{campaign.name}</h1>
              <Badge className="text-[10px] bg-purple-100 text-[#7C3AED] hover:bg-purple-100">
                {campaignKolsList.length} KOL dialokasikan
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
              <Calendar className="w-4 h-4 text-[#8E8E93]" />
              <span>
                {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'} -{' '}
                {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>

          <div className="bg-[#FBFBFC] p-4 rounded-2xl border border-[#EEEEF0] min-w-[220px] text-right">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
              Total Budget Kampanye
            </span>
            <span className="text-xl font-bold text-[#7C3AED] block mt-1">
              {formatIDR(total)}
            </span>
          </div>
        </div>
      </Card>

      {/* Budget overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8E8E93] block">Anggaran Teralokasikan</span>
            <span className="text-base font-bold text-[#1C1C1E]">{formatIDR(allocated)}</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8E8E93] block">Sisa Anggaran Bebas</span>
            <span className="text-base font-bold text-[#1C1C1E]">{formatIDR(remaining)}</span>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-center gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#8E8E93]">Persentase Alokasi:</span>
            <span className="font-bold text-[#1C1C1E]">{percent}%</span>
          </div>
          <div className="w-full bg-[#EEEEF0] h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${percent > 95 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#EC4899] to-[#7C3AED]'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Allocated KOLs Table */}
      <Card className="p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#1C1C1E] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#8E8E93]" />
            Daftar KOL Teralokasi
          </h2>
        </div>

        {campaignKolsList.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8E8E93] border border-dashed border-[#EEEEF0] rounded-xl">
            Belum ada KOL yang dialokasikan ke kampanye ini. Klik "+ Alokasikan KOL Baru" untuk memulai.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#EEEEF0] rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FBFBFC] border-b border-[#EEEEF0] text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                  <th className="py-3 px-4">Nama KOL</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Followers</th>
                  <th className="py-3 px-4">Rate Card</th>
                  <th className="py-3 px-4">Budget Alokasi</th>
                  <th className="py-3 px-4">Status Kerja Sama</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEF0]">
                {campaignKolsList.map((kol) => (
                  <tr key={kol.id} className="hover:bg-[#FBFBFC]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1C1C1E]">{kol.kolName}</div>
                      {kol.kolUsername && <div className="text-[10px] text-[#8E8E93]">{kol.kolUsername}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">{kol.kolPlatform}</td>
                    <td className="py-3.5 px-4 text-gray-700">{formatFollowers(kol.kolFollowers)}</td>
                    <td className="py-3.5 px-4 text-gray-700">{formatIDR(kol.kolRate)}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#7C3AED]">{formatIDR(kol.allocatedBudget)}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={kol.status} className="capitalize py-0.5 px-2">{kol.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPerfModal(kol)}
                          className="h-7 px-2 text-[11px] text-[#7C3AED] hover:bg-purple-50 hover:border-[#7C3AED]/30"
                          title="Input Performa"
                        >
                          <BarChart2 className="w-3.5 h-3.5 mr-1" />
                          Performa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemove(kol.kolId)}
                          className="w-7 h-7 p-0 hover:text-rose-500 hover:border-rose-100"
                          title="Hapus Alokasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Dialog Alokasi KOL */}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Alokasikan KOL Baru">
        <form onSubmit={handleAllocate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1C1C1E]">Pilih KOL</label>
            <select
              value={selectedKolId}
              onChange={(e) => setSelectedKolId(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#EEEEF0] rounded-xl text-[#1C1C1E] focus:outline-none"
              required
            >
              {availableKols.map((k) => {
                // Check if already allocated
                const isAllocated = campaignKolsList.some((ac) => ac.kolId === k.id)
                return (
                  <option key={k.id} value={k.id} disabled={isAllocated}>
                    {k.name} ({k.platform}) — Followers: {formatFollowers(k.followers)} {isAllocated ? '(Sudah Teralokasi)' : ''}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1C1C1E]">Budget Alokasi untuk KOL ini (IDR)</label>
            <Input
              type="number"
              placeholder="Contoh: 5000000"
              value={allocatedBudget}
              onChange={(e) => setAllocatedBudget(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEEEF0] mt-2">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Alokasikan</Button>
          </div>
        </form>
      </Dialog>

      {/* Dialog Input Performa */}
      <PerformanceModal
        isOpen={isPerfModalOpen}
        onClose={() => setIsPerfModalOpen(false)}
        onSuccess={loadData}
        item={perfItem}
      />
    </div>
  )
}
