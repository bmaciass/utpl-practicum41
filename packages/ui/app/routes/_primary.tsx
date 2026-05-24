import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Outlet, useLoaderData } from '@remix-run/react'
import { AppSidebar } from '~/components/layout/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { requireAuthPayload } from '~/helpers/withAuth'

export const loader = async (args: LoaderFunctionArgs) => {
  const result = await requireAuthPayload(args)
  if (result instanceof Response) {
    return result
  }

  return {
    roles: result.roles ?? [],
  }
}

export default function Layout() {
  const { roles } = useLoaderData<typeof loader>() as { roles: string[] }
  const isAdmin = roles.includes('admin')

  return (
    <SidebarProvider defaultOpen={true}>
      <div className='flex min-h-screen w-full bg-background'>
        <AppSidebar isAdmin={isAdmin} />
        <div className='flex flex-1 flex-col'>
          {/* Mobile header with hamburger menu */}
          <header className='flex items-center border-b border-border/70 bg-card/95 px-4 py-3 shadow-sm backdrop-blur-sm md:hidden'>
            <SidebarTrigger className='text-foreground hover:bg-accent/80' />
            <div className='ml-4 flex flex-col'>
              <h1 className='font-semibold tracking-tight'>UTPL Practicum</h1>
              <p className='text-xs text-muted-foreground'>
                Control institucional
              </p>
            </div>
          </header>

          {/* Main content area */}
          <main className='flex-1 bg-background p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
