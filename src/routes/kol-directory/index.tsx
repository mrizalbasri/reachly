import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Search, Users, Eye, Kanban, Trash2, CheckCircle2, Download, Printer } from 'lucide-react'

import { getKols, deleteKol } from '../../server/kol'
import { createPipelineEntry } from '../../server/pipeline'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Dialog } from '../../components/ui/dialog'
import { KolForm } from '../../components/kol/kol-form'
import { CustomSelect } from '../../components/ui/custom-select'
import { formatFollowers, formatIDR } from '../../utils/formatters'
import { downloadCSV, printPDFReport } from '../../utils/export'
import { useToast } from '../../components/ui/toast'

export const Route = createFileRoute('/kol-directory/')({
  component: KolDirectoryPage,
})

function getAvatarBg(name: string): string {
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

function KolDirectoryPage() {
  const toast = useToast()
  const [kolsList, setKolsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [niche, setNiche] = useState('all')
  const [platform, setPlatform] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [addedPipelineId, setAddedPipelineId] = useState<string | null>(null)

  const fetchKols = async () => {
    setLoading(true)
    try {
      const data = await getKols({ data: { search, niche, platform } })
      setKolsList(data)
    } catch (err) {
      console.error(err)
      toast.error('Gagal Memuat KOL', 'Terjadi kesalahan saat memuat direktori KOL.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKols()
  }, [search, niche, platform])

  const handleAddToPipeline = async (kolId: string, kolName: string) => {
    try {
      await createPipelineEntry({ data: { kolId, status: 'prospek' } })
      setAddedPipelineId(kolId)
      toast.success('Masuk Pipeline', `${kolName} berhasil dimasukkan ke Pipeline Prospek.`)
      setTimeout(() => setAddedPipelineId(null), 2500)
    } catch (err) {
      console.error(err)
      toast.error('Gagal', 'Terjadi kesalahan saat menambahkan KOL ke pipeline.')
    }
  }

  const handleDeleteKol = async (kolId: string, kolName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data KOL ${kolName}?`)) return
    try {
      await deleteKol({ data: kolId })
      toast.info('KOL Dihapus', `Data ${kolName} telah dihapus dari direktori.`)
      fetchKols()
    } catch (err) {
      console.error(err)
      toast.error('Gagal Menghapus', 'Tidak dapat menghapus data KOL.')
    }
  }

  const handleExportKols = () => {
    if (!kolsList.length) return
    const headers = ['Nama KOL', 'Platform', 'Username', 'Niche', 'Followers', 'Engagement Rate', 'Rate Card (IDR)', 'Kontak', 'Catatan']
    const exportRows = kolsList.map((k) => [
      k.name || '',
      k.platform || '',
      k.username || '',
      k.niche || '',
      k.followers || 0,
      k.engagementRate ? `${k.engagementRate}%` : '-',
      k.ratePerPost || '0',
      k.contact || '',
      k.notes || '',
    ])
    downloadCSV(`direktori_kol_reachly_${new Date().toISOString().slice(0, 10)}.csv`, headers, exportRows)
    toast.success('Ekspor CSV Berhasil', 'File CSV direktori KOL telah diunduh.')
  }

  const handleExportKolsPDF = () => {
    if (!kolsList.length) return
    const headers = ['Nama KOL', 'Platform', 'Username', 'Niche', 'Followers', 'Engagement Rate', 'Rate Card (IDR)', 'Kontak']
    const exportRows = kolsList.map((k) => [
      k.name || '',
      k.platform || '',
      k.username ? `@${k.username}` : '-',
      k.niche || 'General',
      formatFollowers(k.followers),
      k.engagementRate ? `${k.engagementRate}%` : '-',
      formatIDR(k.ratePerPost || 0),
      k.contact || '-',
    ])

    const summaryCards = [
      { label: 'Total KOL Terdaftar', value: kolsList.length },
      { label: 'Filter Platform', value: platform === 'all' ? 'Semua Platform' : platform },
      { label: 'Filter Niche', value: niche === 'all' ? 'Semua Niche' : niche },
    ]

    printPDFReport(
      'Laporan Direktori KOL',
      'Daftar kandidat KOL beserta estimasi rate card dan performa',
      headers,
      exportRows,
      summaryCards
    )
    toast.info('Menyiapkan Cetak PDF', 'Jendela laporan cetak/PDF telah dibuka.')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">Direktori KOL</h1>
          <p className="text-xs text-[#8E8E93] mt-1">
            Database terpusat influencer & KOL untuk riset campaign yang efisien.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <Button
            onClick={handleExportKols}
            variant="outline"
            disabled={kolsList.length === 0}
            className="text-xs text-[#7C3AED] border-purple-200 hover:bg-purple-50 shadow-xs"
          >
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
          <Button
            onClick={handleExportKolsPDF}
            variant="outline"
            disabled={kolsList.length === 0}
            className="text-xs text-indigo-700 bg-indigo-50/50 border-indigo-200 hover:bg-indigo-100/70 font-medium shadow-xs"
          >
            <Printer className="w-4 h-4 mr-1" />
            Cetak PDF
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="shadow-sm">
            <Plus className="w-4 h-4" />
            Tambah KOL Baru
          </Button>
        </div>

      </div>

      {/* Main Hybrid Layout (Sub-Sidebar Left + Glass Content Right) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sub-Sidebar Panel */}
        <aside className="w-full lg:w-64 glass-panel p-5 rounded-2xl flex flex-col gap-5 shrink-0">
          <div>
            <h3 className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider mb-2.5">Cari & Filter</h3>
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                placeholder="Nama KOL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/90 border border-[#EEEEF0] rounded-xl focus:outline-none focus:border-[#7C3AED] transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Platform</label>
            <CustomSelect
              value={platform}
              onChange={setPlatform}
              className="w-full"
              options={[
                { value: 'all', label: 'Semua Platform' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'TikTok', label: 'TikTok' },
                { value: 'YouTube', label: 'YouTube' },
                { value: 'Twitter', label: 'Twitter / X' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Niche</label>
            <CustomSelect
              value={niche}
              onChange={setNiche}
              className="w-full"
              options={[
                { value: 'all', label: 'Semua Niche' },
                { value: 'Beauty', label: 'Beauty & Skincare' },
                { value: 'Fashion', label: 'Fashion & Style' },
                { value: 'Culinary', label: 'Food & Culinary' },
                { value: 'Tech', label: 'Tech & Gadgets' },
                { value: 'Gaming', label: 'Gaming' },
                { value: 'Fitness', label: 'Fitness & Health' },
                { value: 'Lifestyle', label: 'Travel & Lifestyle' },
                { value: 'Parenting', label: 'Parenting' },
                { value: 'Finance', label: 'Finance & Business' },
              ]}
            />
          </div>

          <div className="pt-3 border-t border-[#EEEEF0]/80">
            <div className="flex items-center justify-between text-xs text-[#8E8E93]">
              <span>Total Hasil:</span>
              <span className="font-semibold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full">{kolsList.length} KOL</span>
            </div>
          </div>
        </aside>

        {/* Right Glass Content Canvas */}
        <div className="flex-1 w-full">

      {/* KOL Table / Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#8E8E93]">Memuat data KOL...</div>
      ) : kolsList.length === 0 ? (
        <Card className="py-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-sm text-[#1C1C1E]">Belum Ada Data KOL</h3>
          <p className="text-xs text-[#8E8E93] max-w-sm">
            Mulai tambahkan kandidat KOL pertama Anda untuk mempermudah riset dan pelacakan campaign.
          </p>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="w-3.5 h-3.5" />
            Tambah KOL Pertama
          </Button>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-[16px] border border-[#EEEEF0] bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FBFBFC] border-b border-[#EEEEF0] text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                <th className="py-3 px-4">KOL</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Niche</th>
                <th className="py-3 px-4">Followers</th>
                <th className="py-3 px-4">ER (%)</th>
                <th className="py-3 px-4">Rate Card</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEF0] text-xs">
              {kolsList.map((kol) => {
                const gradient = getAvatarBg(kol.name)
                const isAdded = addedPipelineId === kol.id

                return (
                  <tr key={kol.id} className="hover:bg-[#FBFBFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-tr ${gradient} text-white font-bold text-xs flex items-center justify-center shadow-xs`}
                        >
                          {kol.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            to="/kol-directory/$kolId"
                            params={{ kolId: kol.id }}
                            className="font-semibold text-[#1C1C1E] hover:text-[#7C3AED] transition-colors"
                          >
                            {kol.name}
                          </Link>
                          {kol.username && (
                            <div className="text-[11px] text-[#8E8E93]">{kol.username}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1C1C1E]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {kol.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8E8E93]">{kol.niche || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-[#1C1C1E]">
                      {formatFollowers(kol.followers)}
                    </td>
                    <td className="py-3 px-4 text-[#8E8E93]">
                      {kol.engagementRate ? `${kol.engagementRate}%` : '-'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#7C3AED]">
                      {formatIDR(kol.ratePerPost)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to="/kol-directory/$kolId" params={{ kolId: kol.id }}>
                          <Button variant="ghost" size="sm" title="Lihat Detail">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant={isAdded ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleAddToPipeline(kol.id)}
                          title="Tambah ke Pipeline Prospek"
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px] text-emerald-600">Masuk</span>
                            </>
                          ) : (
                            <>
                              <Kanban className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Pipeline</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKol(kol.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50"
                          title="Hapus KOL"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
        </div>
      </div>

      {/* Modal Form Tambah KOL */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Tambah KOL Baru"
      >
        <KolForm
          onSuccess={() => {
            setIsFormOpen(false)
            fetchKols()
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Dialog>
    </div>
  )
}
