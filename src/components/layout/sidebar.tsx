import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  Kanban,
  Megaphone,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    {
      label: 'Dasbor',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Direktori KOL',
      path: '/kol-directory',
      icon: Users,
    },
    {
      label: 'Pipeline Proyek',
      path: '/pipeline',
      icon: Kanban,
    },
    {
      label: 'Kampanye',
      path: '/campaigns',
      icon: Megaphone,
    },
    {
      label: 'Analisis ROI',
      path: '/analytics',
      icon: BarChart2,
    },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-3.5 py-4 border-b border-[#EEEEF0]/80">
          <Link
            to="/dashboard"
            onClick={onMobileClose}
            className={`flex items-center gap-3 group overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <img
              src="/logo.webp"
              alt="Reachly Logo"
              className="w-9 h-9 rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0 object-contain"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-lg tracking-tight text-[#1C1C1E] leading-none">
                  Reach<span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">ly</span>
                </span>
                <span className="text-[10px] font-medium text-[#8E8E93] mt-0.5 truncate">
                  KOL Workspace
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggle}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Perluas Sidebar (⌘B)' : 'Lipat Sidebar (⌘B)'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 space-y-1">
          <div className={`px-2 mb-2 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider ${isCollapsed ? 'text-center text-[9px]' : ''}`}>
            {isCollapsed ? '•••' : 'Menu Utama'}
          </div>
          {navItems.map((item) => {
            const isActive =
              currentPath.startsWith(item.path) ||
              (item.path === '/dashboard' && currentPath === '/')
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={`relative flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-150 group ${
                  isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''
                } ${
                  isActive
                    ? 'bg-[#7C3AED]/10 text-[#7C3AED] font-semibold shadow-2xs'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-gray-100/80'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#7C3AED] rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#7C3AED]' : ''
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-[#EEEEF0]/80 space-y-2">
        {!isCollapsed ? (
          <div className="bg-gradient-to-br from-[#7C3AED]/5 to-[#EC4899]/5 border border-[#7C3AED]/15 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reachly Pro</span>
            </div>
            <p className="text-[11px] text-[#8E8E93] leading-relaxed">
              Manajemen KOL & Campaign tanpa batas.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]" title="Reachly Pro Active">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar Sheet */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FBFBFC] border-r border-[#EEEEF0] shadow-xl md:hidden transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar (Sticky/Fixed) */}
      <aside
        className={`hidden md:block sticky top-0 h-screen bg-[#FBFBFC] border-r border-[#EEEEF0] shrink-0 transition-all duration-200 ease-in-out z-40 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
