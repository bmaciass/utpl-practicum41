import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Outlet, useLoaderData } from '@remix-run/react'
import { AppSidebar } from '~/components/layout/AppSidebar'
import { AppTopBar } from '~/components/layout/AppTopBar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { BreadcrumbNameProvider } from '~/context/BreadcrumbNames'
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
      <BreadcrumbNameProvider>
        <div className='flex min-h-screen w-full bg-background'>
          <AppSidebar isAdmin={isAdmin} />
          <div className='flex flex-1 flex-col'>
            <AppTopBar />
            <main className='flex-1 bg-background p-6'>
              <Outlet />
            </main>
          </div>
        </div>
      </BreadcrumbNameProvider>
    </SidebarProvider>
  )
}
