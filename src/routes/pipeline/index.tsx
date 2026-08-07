import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, History } from 'lucide-react'

import {
  getPipelineEntries,
  updatePipelineStatus,
  deletePipelineEntry,
  type PipelineStatusType,
} from '../../server/pipeline'
import { getKols } from '../../server/kol'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Dialog } from '../../components/ui/dialog'
import { PipelineHistoryModal } from '../../components/pipeline/pipeline-history-modal'
import { useToast } from '../../components/ui/toast'

export const Route = createFileRoute('/pipeline/')({
  component: PipelinePage,
})

const COLUMNS: { id: PipelineStatusType; title: string }[] = [
  { id: 'prospek', title: 'Prospek' },
  { id: 'outreach', title: 'Outreach' },
  { id: 'nego', title: 'Nego' },
  { id: 'deal', title: 'Deal' },
  { id: 'posting', title: 'Posting' },
  { id: 'selesai', title: 'Selesai' },
]

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

function PipelinePage() {
  const toast = useToast()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState<any | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [availableKols, setAvailableKols] = useState<any[]>([])
  const [selectedKolId, setSelectedKolId] = useState('')

  // History Modal State
  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean
    pipelineEntryId: string
    kolName: string
  }>({
    isOpen: false,
    pipelineEntryId: '',
    kolName: '',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const data = await getPipelineEntries()
      setEntries(data)
    } catch (err) {
      console.error(err)
      toast.error('Gagal Memuat Pipeline', 'Terjadi kesalahan saat mengambil data pipeline.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleOpenAdd = async () => {
    try {
      const kols = await getKols()
      setAvailableKols(kols)
      if (kols.length > 0) setSelectedKolId(kols[0].id)
      setIsAddOpen(true)
    } catch (err) {
      console.error(err)
      toast.error('Gagal Memuat KOL', 'Tidak dapat mengambil daftar KOL.')
    }
  }

  const handleCreateEntry = async () => {
    if (!selectedKolId) {
      toast.warning('Pilih KOL', 'Silakan pilih KOL terlebih dahulu.')
      return
    }
    const kol = availableKols.find((k) => k.id === selectedKolId)
    try {
      await updatePipelineStatus({ data: { id: selectedKolId, status: 'prospek' } })
      toast.success('KOL Ditambahkan', `${kol?.name || 'KOL'} berhasil dipindahkan ke Prospek.`)
      fetchEntries()
      setIsAddOpen(false)
    } catch (err) {
      // If error (not in pipeline yet), try insert
      try {
        const { createPipelineEntry } = await import('../../server/pipeline')
        await createPipelineEntry({ data: { kolId: selectedKolId, status: 'prospek' } })
        toast.success('KOL Ditambahkan', `${kol?.name || 'KOL'} berhasil dimasukkan ke Pipeline Prospek.`)
        fetchEntries()
        setIsAddOpen(false)
      } catch (e) {
        console.error(e)
        toast.error('Gagal Menambahkan', 'Terjadi kesalahan saat menambahkan KOL ke pipeline.')
      }
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const item = entries.find((e) => e.id === event.active.id)
    if (item) setActiveCard(item)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find target column status
    const targetColumn = COLUMNS.find((col) => col.id === overId)
    let newStatus: PipelineStatusType | null = targetColumn ? targetColumn.id : null

    if (!newStatus) {
      const overEntry = entries.find((e) => e.id === overId)
      if (overEntry) newStatus = overEntry.status as PipelineStatusType
    }

    if (newStatus) {
      const activeEntry = entries.find((e) => e.id === activeId)
      if (activeEntry && activeEntry.status === newStatus) return

      setEntries((prev) =>
        prev.map((item) => (item.id === activeId ? { ...item, status: newStatus } : item))
      )

      try {
        await updatePipelineStatus({ data: { id: activeId, status: newStatus } })
        toast.success('Status Diperbarui', `${activeEntry?.kolName || 'KOL'} dipindahkan ke ${newStatus}.`)
      } catch (err) {
        console.error(err)
        toast.error('Gagal Memperbarui Status', 'Perubahan status tidak tersimpan di server.')
        fetchEntries()
      }
    }
  }

  const handleMoveColumn = async (entryId: string, newStatus: PipelineStatusType) => {
    const activeEntry = entries.find((e) => e.id === entryId)
    if (activeEntry && activeEntry.status === newStatus) return

    setEntries((prev) =>
      prev.map((item) => (item.id === entryId ? { ...item, status: newStatus } : item))
    )
    try {
      await updatePipelineStatus({ data: { id: entryId, status: newStatus } })
      toast.success('Status Diperbarui', `${activeEntry?.kolName || 'KOL'} dipindahkan ke ${newStatus}.`)
    } catch (err) {
      console.error(err)
      toast.error('Gagal Memperbarui Status', 'Perubahan status tidak tersimpan di server.')
      fetchEntries()
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Hapus entry dari pipeline?')) return
    try {
      await deletePipelineEntry({ data: entryId })
      toast.info('Entry Dihapus', 'Entry KOL berhasil dihapus dari pipeline.')
      fetchEntries()
    } catch (err) {
      console.error(err)
      toast.error('Gagal Menghapus', 'Tidak dapat menghapus entry pipeline.')
    }
  }

  const handleOpenHistory = (entry: any) => {
    setHistoryModal({
      isOpen: true,
      pipelineEntryId: entry.id,
      kolName: entry.kolName || 'KOL',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">Pipeline Proyek</h1>
          <p className="text-xs text-[#8E8E93] mt-1">
            Lacak status negosiasi dan progres kerja sama tiap KOL dalam bentuk Kanban Board.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="self-start md:self-auto">
          <Plus className="w-4 h-4" />
          Tambah ke Pipeline
        </Button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#8E8E93]">Memuat data Pipeline...</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full pb-6 pt-1">
            {COLUMNS.map((col) => {
              const columnEntries = entries.filter((e) => e.status === col.id)

              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  entries={columnEntries}
                  onMove={handleMoveColumn}
                  onDelete={handleDeleteEntry}
                  onOpenHistory={handleOpenHistory}
                />
              )
            })}
          </div>

          <DragOverlay>
            {activeCard ? <KanbanCardItem entry={activeCard} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Add Modal */}
      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah KOL ke Pipeline">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#8E8E93]">
            Pilih KOL dari direktori yang ingin dimasukkan ke status awal (Prospek).
          </p>
          {availableKols.length === 0 ? (
            <p className="text-xs text-red-500">Belum ada KOL di direktori. Tambahkan KOL terlebih dahulu.</p>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#1C1C1E] mb-1">Pilih KOL</label>
                <select
                  value={selectedKolId}
                  onChange={(e) => setSelectedKolId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#EEEEF0] bg-white focus:outline-none focus:border-[#7C3AED]"
                >
                  {availableKols.map((kol) => (
                    <option key={kol.id} value={kol.id}>
                      {kol.name} ({kol.platform} — {kol.niche || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEEEF0]">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreateEntry}>Tambahkan ke Pipeline</Button>
              </div>
            </>
          )}
        </div>
      </Dialog>

      {/* History Log Modal */}
      <PipelineHistoryModal
        isOpen={historyModal.isOpen}
        onClose={() => setHistoryModal((prev) => ({ ...prev, isOpen: false }))}
        pipelineEntryId={historyModal.pipelineEntryId}
        kolName={historyModal.kolName}
      />
    </div>
  )
}

function KanbanColumn({
  column,
  entries,
  onMove,
  onDelete,
  onOpenHistory,
}: {
  column: { id: PipelineStatusType; title: string }
  entries: any[]
  onMove: (id: string, newStatus: PipelineStatusType) => void
  onDelete: (id: string) => void
  onOpenHistory?: (entry: any) => void
}) {
  return (
    <div className="w-full glass-panel rounded-2xl p-3 flex flex-col gap-3 min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <Badge status={column.id} className="text-[10px] px-2 py-0.5">{column.title}</Badge>
        </div>
        <span className="text-[10px] font-bold text-[#8E8E93] bg-white/90 px-1.5 py-0.2 rounded-full border border-[#EEEEF0]/80">
          {entries.length}
        </span>
      </div>

      {/* Sortable Area */}
      <SortableContext items={entries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 flex flex-col gap-2.5">
          {entries.length === 0 ? (
            <div className="flex-1 border border-dashed border-[#EEEEF0] rounded-xl flex items-center justify-center p-4 text-[11px] text-[#8E8E93]">
              Kosong
            </div>
          ) : (
            entries.map((entry) => (
              <SortableKanbanCard
                key={entry.id}
                entry={entry}
                onMove={onMove}
                onDelete={onDelete}
                onOpenHistory={onOpenHistory}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableKanbanCard({
  entry,
  onMove,
  onDelete,
  onOpenHistory,
}: {
  entry: any
  onMove: (id: string, newStatus: PipelineStatusType) => void
  onDelete: (id: string) => void
  onOpenHistory?: (entry: any) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCardItem entry={entry} onMove={onMove} onDelete={onDelete} onOpenHistory={onOpenHistory} />
    </div>
  )
}

function KanbanCardItem({
  entry,
  onMove,
  onDelete,
  onOpenHistory,
  isOverlay = false,
}: {
  entry: any
  onMove?: (id: string, newStatus: PipelineStatusType) => void
  onDelete?: (id: string) => void
  onOpenHistory?: (entry: any) => void
  isOverlay?: boolean
}) {
  return (
    <Card
      className={`p-3.5 space-y-2.5 hover:border-[#7C3AED]/30 transition-all ${
        isOverlay ? 'shadow-xl rotate-1 scale-105 bg-white z-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-bold text-xs text-[#1C1C1E]">{entry.kolName || 'KOL tanpa nama'}</h4>
          <span className="text-[10px] text-[#8E8E93]">
            {entry.kolPlatform} • {formatFollowers(entry.kolFollowers)} followers
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {onOpenHistory && (
            <button
              onClick={() => onOpenHistory(entry)}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
              title="Lihat Riwayat Pipeline"
            >
              <History className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
        <span className="text-[#8E8E93]">Rate:</span>
        <span className="font-semibold text-[#7C3AED]">{formatIDR(entry.kolRate)}</span>
      </div>

      {/* Quick status selector */}
      {onMove && (
        <div className="pt-1 flex items-center justify-between gap-1 text-[10px]">
          <span className="text-gray-400">Pindah:</span>
          <select
            value={entry.status}
            onChange={(e) => onMove(entry.id, e.target.value as PipelineStatusType)}
            className="text-[10px] py-0.5 px-1 rounded border border-gray-200 bg-white text-gray-700 focus:outline-none"
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </Card>
  )
}
