import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ClerkProvider from '../integrations/clerk/provider'
import Navbar from '../components/layout/navbar'

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
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#FFFFFF] text-[#1C1C1E] min-h-screen flex flex-col antialiased">
        <ClerkProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
            {children || <Outlet />}
          </main>
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
        <Scripts />
      </body>
    </html>
  )
}
