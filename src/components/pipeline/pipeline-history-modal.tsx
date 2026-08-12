import { useState, useEffect } from 'react'
import { Clock, ArrowRight, FileText } from 'lucide-react'
import { Dialog } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { getPipelineLogs } from '../../server/pipeline'

interface PipelineHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  pipelineEntryId: string
  kolName: string
}

export function PipelineHistoryModal({
  isOpen,
  onClose,
  pipelineEntryId,
  kolName,
}: PipelineHistoryModalProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && pipelineEntryId) {
      setLoading(true)
      getPipelineLogs({ data: { pipelineEntryId } })
        .then((res) => {
          setLogs(res || [])
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [isOpen, pipelineEntryId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospek':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'outreach':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'nego':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'deal':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'posting':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'selesai':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Riwayat Pipeline — ${kolName}`}>
      <div className="py-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Clock className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Memuat riwayat...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-600">Belum ada riwayat aktivitas</p>
            <p className="text-xs text-slate-400 mt-1">
              Riwayat akan tercatat otomatis ketika status negosiasi diperbarui.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 max-h-[60vh] overflow-y-auto pr-2">
            {logs.map((log) => {
              const dateStr = log.createdAt
                ? new Date(log.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />

                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {log.fromStatus && (
                          <>
                            <Badge className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${getStatusColor(log.fromStatus)}`}>
                              {log.fromStatus}
                            </Badge>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </>
                        )}
                        <Badge className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${getStatusColor(log.toStatus)}`}>
                          {log.toStatus}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {dateStr}
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed font-normal bg-white p-2 rounded-lg border border-slate-100 mt-1">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Dialog>
  )
}


