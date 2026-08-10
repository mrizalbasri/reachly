import { useState, useEffect } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ClerkProvider from '../integrations/clerk/provider'
import Sidebar from '../components/layout/sidebar'
import TopHeader from '../components/layout/top-header'
import { ToastProvider } from '../components/ui/toast'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Reachly — Platform Manajemen Kerja Sama Influencer/KOL',
      },
      {
        name: 'description',
        content: 'Platform manajemen kerja sama influencer/KOL terpusat untuk brand dan agency di Indonesia.',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/logo.webp',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)

  // Load initial state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('reachly_sidebar_collapsed')
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
  }, [])

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('reachly_sidebar_collapsed', String(next))
      return next
    })
  }

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#FFFFFF] text-[#1C1C1E] min-h-screen antialiased">
        <ToastProvider>
          <ClerkProvider>
            <div className="flex min-h-screen bg-[#FFFFFF]">
              {/* Sidebar */}
              <Sidebar
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
              />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                <TopHeader onMobileMenuOpen={() => setIsMobileOpen(true)} />
                <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
                  <div key={location.pathname} className="page-transition">
                    {children || <Outlet />}
                  </div>
                </main>
              </div>
            </div>

            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </ClerkProvider>
        </ToastProvider>
        <Scripts />
      </body>
    </html>
  )
}


