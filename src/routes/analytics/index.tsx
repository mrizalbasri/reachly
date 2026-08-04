import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  BarChart2,
  Eye,
  ThumbsUp,
  DollarSign,
  TrendingUp,
  Filter,
  Plus,
  Edit2,
  Award,
  Sparkles,
  Download,
} from 'lucide-react'
import { getAnalyticsOverview } from '../../server/analytics'
import { getCampaigns } from '../../server/campaigns'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { PerformanceModal } from '../../components/analytics/performance-modal'
import { CustomSelect } from '../../components/ui/custom-select'
import { formatFollowers, formatIDR } from '../../utils/formatters'
import { downloadCSV } from '../../utils/export'

export const Route = createFileRoute('/analytics/')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [campaignList, setCampaignList] = useState<any[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<any>(null)

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const overview = await getAnalyticsOverview({
        data: {
          campaignId: selectedCampaign,
          platform: selectedPlatform,
        },
      })
      setData(overview)

      const camps = await getCampaigns()
      setCampaignList(camps)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [selectedCampaign, selectedPlatform])

  const handleOpenModal = (row: any) => {
    setActiveItem({
      campaignKolId: row.campaignKolId,
      kolName: row.kolName,
      campaignName: row.campaignName,
      views: row.views,
      engagement: row.engagement,
      conversions: row.conversions,
    })
    setIsModalOpen(true)
  }

  const summary = data?.summary || {
    totalViews: 0,
    totalEngagement: 0,
    totalConversions: 0,
    totalBudgetAllocated: 0,
    avgCpm: '0',
    avgCpe: '0',
    avgCpv: '0',
  }

  const rows = data?.rows || []

  const handleExportAnalytics = () => {
    if (!rows.length) return
    const headers = [
      'Nama KOL',
      'Platform',
      'Username',
      'Kampanye',
      'Budget Teralokasi (IDR)',
      'Views',
      'Engagement',
      'Conversions',
      'CPM (IDR)',
      'CPE (IDR)',
    ]
    const exportRows = rows.map((r: any) => [
      r.kolName || '',
      r.kolPlatform || '',
      r.kolUsername || '',
      r.campaignName || '',
      r.allocatedBudget || '0',
      r.views || 0,
      r.engagement || 0,
      r.conversions || 0,
      r.cpm || '-',
      r.cpe || '-',
    ])
    downloadCSV(`laporan_analytics_reachly_${new Date().toISOString().slice(0, 10)}.csv`, headers, exportRows)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#7C3AED]" />
            Analisis Kinerja & ROI Kampanye
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1">
            Ukur efisiensi biaya kampanye KOL berdasarkan metrik CPM (Cost per 1k Views), CPE (Cost per Engagement), dan CPV.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 bg-white p-1.5 rounded-2xl border border-[#EEEEF0] shadow-xs shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] pl-2 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Filter:</span>
          </div>

          <CustomSelect
            value={selectedCampaign}
            onChange={setSelectedCampaign}
            options={[
              { value: 'all', label: 'Semua Kampanye' },
              ...campaignList.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />

          <CustomSelect
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            options={[
              { value: 'all', label: 'Semua Platform' },
              { value: 'Instagram', label: 'Instagram' },
              { value: 'TikTok', label: 'TikTok' },
              { value: 'YouTube', label: 'YouTube' },
              { value: 'Twitter', label: 'Twitter' },
            ]}
          />
        </div>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Total Impresi (Views)
            </span>
            <span className="text-2xl font-bold text-[#1C1C1E]">
              {formatFollowers(summary.totalViews)}
            </span>
          </div>
        </Card>

        {/* Total Engagement */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#EC4899] flex items-center justify-center">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Total Engagement
            </span>
            <span className="text-2xl font-bold text-[#1C1C1E]">
              {formatFollowers(summary.totalEngagement)}
            </span>
          </div>
        </Card>

        {/* Rata-Rata CPM */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Rata-Rata CPM (Per 1k Views)
            </span>
            <span className="text-2xl font-bold text-[#10B981]">
              {formatIDR(summary.avgCpm)}
            </span>
          </div>
        </Card>

        {/* Rata-Rata CPE */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Rata-Rata CPE (Per Engagement)
            </span>
            <span className="text-2xl font-bold text-[#1C1C1E]">
              {formatIDR(summary.avgCpe)}
            </span>
          </div>
        </Card>
      </div>

      {/* Performance Leaderboard Table */}
      <Card className="overflow-hidden border border-[#EEEEF0] shadow-sm">
        <div className="p-5 border-b border-[#EEEEF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="font-bold text-base text-[#1C1C1E]">Efisiensi & Ranking Performa KOL</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportAnalytics}
              variant="outline"
              size="sm"
              disabled={rows.length === 0}
              className="h-8 px-3 text-xs text-[#7C3AED] border-purple-200 hover:bg-purple-50 flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor Laporan (CSV)
            </Button>
            <span className="text-xs text-[#8E8E93] border-l border-[#EEEEF0] pl-3">
              {rows.length} Alokasi KOL Terdaftar
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#8E8E93]">Memuat data analisis...</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-gray-300" />
            <p className="text-sm font-semibold text-[#1C1C1E]">Belum Ada Data Performa</p>
            <p className="text-xs text-[#8E8E93] max-w-sm">
              Alokasikan KOL ke dalam kampanye terlebih dahulu di halaman Kampanye, lalu input hasil tayangan di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FBFBFC] border-b border-[#EEEEF0] text-[11px] font-semibold uppercase text-[#8E8E93] tracking-wider">
                  <th className="py-3 px-4">KOL & Platform</th>
                  <th className="py-3 px-4">Kampanye</th>
                  <th className="py-3 px-4 text-right">Budget Teralokasi</th>
                  <th className="py-3 px-4 text-right">Views</th>
                  <th className="py-3 px-4 text-right">Engagement</th>
                  <th className="py-3 px-4 text-right">CPM (1k Views)</th>
                  <th className="py-3 px-4 text-right">CPE</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEF0] text-xs">
                {rows.map((row: any) => {
                  const hasData = row.views != null && row.views > 0
                  return (
                    <tr key={row.campaignKolId} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1C1C1E]">{row.kolName}</span>
                          <span className="text-[10px] text-[#8E8E93]">
                            {row.kolPlatform} {row.kolUsername ? `• @${row.kolUsername}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#1C1C1E]">
                        {row.campaignName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#7C3AED]">
                        {formatIDR(row.allocatedBudget)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-[#1C1C1E]">
                        {hasData ? formatFollowers(row.views) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-[#1C1C1E]">
                        {hasData ? formatFollowers(row.engagement) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {row.cpm ? (
                          <Badge className="bg-emerald-50 text-[#10B981] font-semibold border-emerald-100">
                            {formatIDR(row.cpm)}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {row.cpe ? (
                          <span className="font-semibold text-indigo-600">
                            {formatIDR(row.cpe)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(row)}
                          className="h-8 px-2.5 text-xs text-[#7C3AED] hover:bg-purple-50 hover:border-[#7C3AED]/30"
                        >
                          {hasData ? (
                            <>
                              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Performa
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 mr-1" /> Input Performa
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Performance Modal */}
      <PerformanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAnalytics}
        item={activeItem}
      />
    </div>
  )
}
