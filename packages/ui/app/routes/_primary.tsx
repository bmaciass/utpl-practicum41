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
  const { roles } = useLoaderData<typeof loader>()
  const isAdmin = roles.includes('admin')

  return (
    <SidebarProvider defaultOpen={true}>
      <div className='min-h-screen flex w-full'>
        <AppSidebar isAdmin={isAdmin} />
        <div className='flex-1 flex flex-col'>
          {/* Mobile header with hamburger menu */}
          <header className='md:hidden bg-white shadow px-4 py-3 flex items-center'>
            <SidebarTrigger />
            <h1 className='ml-4 font-semibold'>UTPL Practicum</h1>
          </header>

          {/* Main content area */}
          <main className='flex-1 bg-gray-50 p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
