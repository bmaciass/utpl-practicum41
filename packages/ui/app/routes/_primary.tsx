import { Outlet } from '@remix-run/react'
import { AppSidebar } from '~/components/layout/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className='min-h-screen flex w-full'>
        <AppSidebar />
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
