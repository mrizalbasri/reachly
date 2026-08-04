import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, AlertTriangle, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'
import { getNotificationAlerts, type NotificationAlert } from '../../server/notifications'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [alerts, setAlerts] = useState<NotificationAlert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await getNotificationAlerts()
      setAlerts(res.alerts || [])
      setUnreadCount(res.unreadCount || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()

    // Close popover when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchAlerts()
        }}
        className="relative w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs border border-[#EEEEF0] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-white transition-all shadow-xs"
        title="Notifikasi & Peringatan Tenggat Waktu"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#EEEEF0] z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="p-3.5 border-b border-[#EEEEF0] flex items-center justify-between bg-[#FBFBFC]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7C3AED]" />
              <span className="font-bold text-xs text-[#1C1C1E]">Peringatan & Tenggat Waktu</span>
            </div>
            <span className="text-[10px] font-semibold bg-purple-100 text-[#7C3AED] px-2 py-0.5 rounded-full">
              {unreadCount} Alert
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#EEEEF0]">
            {loading ? (
              <div className="py-8 text-center text-xs text-[#8E8E93]">Memuat peringatan...</div>
            ) : alerts.length === 0 ? (
              <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span className="text-xs font-bold text-[#1C1C1E]">Semua Aman!</span>
                <span className="text-[11px] text-[#8E8E93] max-w-xs">
                  Tidak ada tenggat waktu mendekati atau negosiasi menggantung saat ini.
                </span>
              </div>
            ) : (
              alerts.map((item) => {
                const isUrgent = item.type === 'urgent'
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    onClick={() => setIsOpen(false)}
                    className="p-3.5 flex items-start gap-3 hover:bg-purple-50/50 transition-colors block"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                        isUrgent
                          ? 'bg-rose-50 text-rose-500 border border-rose-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      {isUrgent ? <Clock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs text-[#1C1C1E] truncate">{item.title}</span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
                            isUrgent ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isUrgent ? 'Urgent' : '> 7 Hari'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8E8E93] leading-relaxed line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 self-center" />
                  </Link>
                )
              })
            )}
          </div>

          {alerts.length > 0 && (
            <div className="p-2.5 bg-[#FBFBFC] border-t border-[#EEEEF0] text-center">
              <Link
                to="/pipeline"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-[#7C3AED] hover:underline"
              >
                Lihat Semua di Pipeline Proyek →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
