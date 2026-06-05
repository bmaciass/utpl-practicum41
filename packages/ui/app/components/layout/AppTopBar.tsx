import { Link } from '@remix-run/react'
import { LogOut, User } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { AppBreadcrumb } from './AppBreadcrumb'

export function AppTopBar() {
  return (
    <header className='sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur-sm'>
      <div className='flex items-center justify-between gap-4 px-4 py-3 sm:px-6'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <SidebarTrigger className='text-foreground hover:bg-accent/80 md:hidden' />
          <AppBreadcrumb />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label='Open user menu'
              className='rounded-full border border-border/70 bg-card text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground'
              size='icon'
              type='button'
              variant='ghost'
            >
              <User className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuItem asChild>
              <Link to='/logout'>
                <LogOut className='h-4 w-4' />
                <span>Cerrar Sesion</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
