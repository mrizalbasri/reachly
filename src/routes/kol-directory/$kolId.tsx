import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, User, Phone, DollarSign, Activity, FileText, Kanban, Trash2 } from 'lucide-react'

import { getKolById, deleteKol } from '../../server/kol'
import { createPipelineEntry } from '../../server/pipeline'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'

export const Route = createFileRoute('/kol-directory/$kolId')({
  component: KolDetailPage,
})

function formatFollowers(num: number | null | undefined): string {
  if (!num) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
  return num.toString()
}

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

function KolDetailPage() {
  const { kolId } = Route.useParams()
  const navigate = useNavigate()
  const [kol, setKol] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [addingPipeline, setAddingPipeline] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getKolById({ data: kolId })
        setKol(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [kolId])

  const handleAddToPipeline = async () => {
    try {
      setAddingPipeline(true)
      await createPipelineEntry({ data: { kolId, status: 'prospek' } })
      navigate({ to: '/pipeline' })
    } catch (err) {
      console.error(err)
    } finally {
      setAddingPipeline(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus data KOL ini?')) return
    try {
      await deleteKol({ data: kolId })
      navigate({ to: '/kol-directory' })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-xs text-[#8E8E93]">Memuat data detail KOL...</div>
  }

  if (!kol) {
    return (
      <div className="py-16 text-center flex flex-col items-center gap-3">
        <h3 className="text-base font-bold text-[#1C1C1E]">KOL Tidak Ditemukan</h3>
        <Link to="/kol-directory">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Direktori
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button & Action Bar */}
      <div className="flex items-center justify-between">
        <Link to="/kol-directory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Direktori
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-500 border-red-200">
            <Trash2 className="w-3.5 h-3.5" />
            Hapus Data
          </Button>
          <Button size="sm" onClick={handleAddToPipeline} disabled={addingPipeline}>
            <Kanban className="w-3.5 h-3.5" />
            {addingPipeline ? 'Menambahkan...' : 'Tambah ke Pipeline'}
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {kol.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[#1C1C1E]">{kol.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-[#7C3AED]">
                {kol.platform}
              </span>
              {kol.niche && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {kol.niche}
                </span>
              )}
            </div>
            {kol.username && <p className="text-sm font-medium text-[#8E8E93]">{kol.username}</p>}
          </div>

          <div className="bg-[#FBFBFC] p-4 rounded-xl border border-[#EEEEF0] min-w-[200px] text-right">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Rate Card / Post
            </span>
            <span className="text-xl font-bold text-[#7C3AED] block mt-0.5">
              {formatIDR(kol.ratePerPost)}
            </span>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8E8E93] block">Total Followers</span>
            <span className="text-lg font-bold text-[#1C1C1E]">{formatFollowers(kol.followers)}</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8E8E93] block">Engagement Rate</span>
            <span className="text-lg font-bold text-[#1C1C1E]">
              {kol.engagementRate ? `${kol.engagementRate}%` : '-'}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8E8E93] block">Est. Cost / 1k Follower</span>
            <span className="text-lg font-bold text-[#1C1C1E]">
              {kol.followers && kol.ratePerPost
                ? formatIDR((parseFloat(kol.ratePerPost) / (kol.followers / 1000)).toFixed(0))
                : '-'}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8E8E93] block">Kontak / Manager</span>
            <span className="text-xs font-semibold text-[#1C1C1E] truncate block max-w-[140px]">
              {kol.contact || '-'}
            </span>
          </div>
        </Card>
      </div>

      {/* Notes & Additional Info */}
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold text-sm text-[#1C1C1E] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#7C3AED]" />
          Catatan Internal
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed bg-[#FBFBFC] p-4 rounded-xl border border-[#EEEEF0]">
          {kol.notes || 'Belum ada catatan internal untuk KOL ini.'}
        </p>
      </Card>
    </div>
  )
}
