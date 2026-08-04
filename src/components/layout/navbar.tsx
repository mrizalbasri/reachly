import { Link, useLocation } from '@tanstack/react-router'
import { Search, Users, Kanban, Megaphone, BarChart2, LayoutDashboard } from 'lucide-react'
import HeaderUser from '../../integrations/clerk/header-user'

export default function Navbar() {
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

  return (
    <header className="sticky top-0 z-50 glass-header px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <img
            src="/logo.webp"
            alt="Reachly Logo"
            className="w-10 h-10 rounded-xl shadow-sm transition-transform group-hover:scale-105 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-[#1C1C1E]">
              Reachly
            </span>
          </div>
        </Link>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-[#FBFBFC]/80 backdrop-blur-md p-1.5 rounded-full border border-[#EEEEF0]/80 shadow-xs">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path) || (item.path === '/dashboard' && currentPath === '/')
            const Icon = item.icon

            if (item.disabled) {
              return (
                <span
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#8E8E93] cursor-not-allowed opacity-60 rounded-full"
                  title="Fitur ini akan hadir pada Fase berikutnya"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded-full">Soon</span>
                </span>
              )
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-sm font-semibold'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Search & User Controls */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="Cari KOL atau campaign... (⌘K)"
              className="pl-9 pr-4 py-1.5 text-xs bg-white/80 backdrop-blur-sm border border-[#EEEEF0] rounded-full w-56 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all shadow-xs"
            />
          </div>

          <div className="pl-2 border-l border-[#EEEEF0]">
            <HeaderUser />
          </div>
        </div>
      </div>
    </header>
  )
}
