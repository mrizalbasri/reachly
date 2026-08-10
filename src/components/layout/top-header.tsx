import { useLocation } from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import HeaderUser from '../../integrations/clerk/header-user'
import { NotificationBell } from './notification-bell'

interface TopHeaderProps {
  onMobileMenuOpen: () => void
}

export default function TopHeader({ onMobileMenuOpen }: TopHeaderProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const getPageTitle = (path: string) => {
    if (path.startsWith('/kol-directory')) return 'Direktori KOL'
    if (path.startsWith('/pipeline')) return 'Pipeline Proyek'
    if (path.startsWith('/campaigns')) return 'Kampanye'
    if (path.startsWith('/analytics')) return 'Analisis ROI'
    return 'Dasbor Utama'
  }

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#EEEEF0] px-4 md:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuOpen}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-[#EEEEF0] bg-white text-[#1C1C1E] shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-bold text-[#1C1C1E] tracking-tight">
              {getPageTitle(currentPath)}
            </h1>
          </div>
        </div>

        {/* Right: Global Search & User Controls */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Cari KOL atau campaign..."
              className="pl-9 pr-4 py-1.5 text-xs bg-[#FBFBFC] border border-[#EEEEF0] rounded-full w-52 md:w-64 focus:outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all shadow-2xs"
            />
          </div>

          <NotificationBell />

          <div className="pl-2 border-l border-[#EEEEF0]">
            <HeaderUser />
          </div>
        </div>
      </div>
    </header>
  )
}
