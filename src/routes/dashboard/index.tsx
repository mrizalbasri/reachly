import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LayoutDashboard, Users, Megaphone, DollarSign, Calendar, Clock, ChevronRight } from 'lucide-react'
import { getDashboardStats } from '../../server/dashboard'
import { getNotificationAlerts, type NotificationAlert } from '../../server/notifications'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
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

function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [alerts, setAlerts] = useState<NotificationAlert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const data = await getDashboardStats()
      setStats(data)
      const alertsData = await getNotificationAlerts()
      setAlerts(alertsData.alerts || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="py-12 text-center text-xs text-[#8E8E93] min-h-[50vh] flex items-center justify-center">
        Memuat dasbor ringkasan...
      </div>
    )
  }

  const budgetCampaigns = parseFloat(stats.totalCampaignsBudget || '0')
  const budgetAllocated = parseFloat(stats.totalBudgetAllocated || '0')
  const budgetRemaining = Math.max(0, budgetCampaigns - budgetAllocated)

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[#7C3AED]" />
          Ringkasan Dasbor
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1">
          Pantau sekilas status kerja sama KOL, progres anggaran, dan deadline kampanye Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total KOL */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">KOL Terdaftar</span>
            <span className="text-2xl font-bold text-[#1C1C1E]">{stats.totalKols}</span>
          </div>
        </Card>

        {/* Active Campaigns */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#EC4899] flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">Kampanye Aktif</span>
            <span className="text-2xl font-bold text-[#1C1C1E]">{stats.activeCampaignsCount}</span>
          </div>
        </Card>

        {/* Total Budget Allocated */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#5B6EF5] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">Anggaran Teralokasi</span>
            <span className="text-lg font-bold text-[#1C1C1E]">{formatIDR(budgetAllocated)}</span>
          </div>
        </Card>

        {/* Budget Remaining */}
        <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-all duration-150">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">Sisa Anggaran Proyek</span>
            <span className="text-lg font-bold text-[#1C1C1E]">{formatIDR(budgetRemaining)}</span>
          </div>
        </Card>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Campaigns (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1C1C1E] uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-[#8E8E93]" />
              Kampanye Berjalan
            </h2>
            <Link to="/campaigns">
              <Button variant="outline" size="sm" className="text-xs">
                Lihat Semua
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {stats.activeCampaigns.length === 0 ? (
            <Card className="p-8 text-center flex flex-col items-center justify-center gap-2">
              <span className="text-xs text-[#8E8E93]">Tidak ada kampanye aktif saat ini.</span>
              <Link to="/campaigns">
                <Button size="sm" className="mt-2">Buat Kampanye Pertama</Button>
              </Link>
            </Card>
          ) : (
            <div className="flex flex-col gap-3.5">
              {stats.activeCampaigns.map((camp: any) => {
                const total = parseFloat(camp.totalBudget || '0')
                const allocated = parseFloat(camp.allocatedBudgetSum || '0')
                const percent = total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0

                return (
                  <Card key={camp.id} className="p-4 hover:border-[#7C3AED]/20 transition-all">
                    <div className="flex justify-between items-start mb-2.5">
                      <div>
                        <Link to="/campaigns/$campaignId" params={{ campaignId: camp.id }} className="font-bold text-sm text-[#1C1C1E] hover:text-[#7C3AED]">
                          {camp.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-[#8E8E93] mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {camp.startDate ? new Date(camp.startDate).toLocaleDateString('id-ID') : 'N/A'} -{' '}
                            {camp.endDate ? new Date(camp.endDate).toLocaleDateString('id-ID') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <Badge className="text-[10px] bg-purple-50 text-[#7C3AED] hover:bg-purple-50">{camp.kolCount} KOL</Badge>
                    </div>

                    {/* Budget progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#8E8E93]">Anggaran Teralokasi: <strong className="text-[#1C1C1E]">{formatIDR(allocated)}</strong></span>
                        <span className="text-[#8E8E93]">{percent}% dari {formatIDR(total)}</span>
                      </div>
                      <div className="w-full bg-[#EEEEF0] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#EC4899] to-[#7C3AED] h-full rounded-full transition-all" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Deadlines & Stale Alerts (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1C1C1E] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              Peringatan & Deadline
            </h2>
            {alerts.length > 0 && (
              <span className="text-[10px] font-semibold bg-purple-100 text-[#7C3AED] px-2 py-0.5 rounded-full">
                {alerts.length} Perhatian
              </span>
            )}
          </div>

          {alerts.length === 0 && stats.soonestDeadlines.length === 0 ? (
            <Card className="p-8 text-center text-xs text-[#8E8E93]">
              Bagus! Tidak ada tenggat waktu (deadline) negosiasi atau posting dalam waktu dekat.
            </Card>
          ) : (
            <Card className="divide-y divide-[#EEEEF0]/60 p-1">
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={alert.link}
                  className="p-3.5 flex items-start justify-between gap-3 text-xs hover:bg-purple-50/40 transition-colors block"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          alert.type === 'urgent' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-bold text-[#1C1C1E] truncate">{alert.title}</span>
                    </div>
                    <p className="text-[11px] text-[#8E8E93] leading-tight line-clamp-2">
                      {alert.message}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 self-center" />
                </Link>
              ))}

              {alerts.length === 0 &&
                stats.soonestDeadlines.map((item: any) => {
                  const deadlineDate = new Date(item.deadline)
                  const isOverdue = deadlineDate < new Date()

                  return (
                    <div key={item.id} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-[#1C1C1E]">
                          {item.kolName} ({item.kolPlatform})
                        </div>
                        <div className="text-[10px] text-[#8E8E93]">
                          Status:{' '}
                          <Badge status={item.status} className="px-1.5 py-0 text-[9px] font-medium capitalize">
                            {item.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-semibold flex items-center gap-1 text-[10px] ${
                            isOverdue ? 'text-rose-500' : 'text-[#7C3AED]'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
