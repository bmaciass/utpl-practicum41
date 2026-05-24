import { Link } from '@remix-run/react'
import { ArrowLeft, Settings } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { Title } from './typography/Headers'

export interface DetailHeroField {
  label: string
  value: React.ReactNode
}

export interface DetailHeroMenuAction {
  label: string
  onClick: () => void
  destructive?: boolean
}

export interface DetailHeroProps {
  backTo: string
  title: string
  active?: boolean
  loading?: boolean
  fields?: DetailHeroField[]
  description?: string | null
  menuActions?: DetailHeroMenuAction[]
  menuDisabled?: boolean
}

export function DetailHero({
  backTo,
  title,
  active,
  loading,
  fields,
  description,
  menuActions,
  menuDisabled,
}: DetailHeroProps) {
  return (
    <div className='rounded-2xl border border-border/70 bg-card p-6 shadow-sm space-y-4'>
      {/* Top row: back + title + badge + gear menu */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link to={backTo}>
            <Button variant='ghost' size='icon'>
              <ArrowLeft />
            </Button>
          </Link>
          {loading ? (
            <Skeleton className='h-6 w-48' />
          ) : (
            <>
              <Title variant='h4'>{title}</Title>
              {active === false && (
                <Badge variant='destructive'>Inactivo</Badge>
              )}
            </>
          )}
        </div>
        {menuActions && menuActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' disabled={menuDisabled}>
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {menuActions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  className={action.destructive ? 'text-destructive' : undefined}
                  onClick={action.onClick}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Details grid + description */}
      {loading ? (
        <Skeleton className='h-20 w-full' />
      ) : (
        <>
          {fields && fields.length > 0 && (
            <div className='grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4'>
              {fields.map((field) => (
                <div key={field.label} className='space-y-1'>
                  <p className='text-sm text-muted-foreground'>{field.label}</p>
                  <p className='font-medium'>{field.value}</p>
                </div>
              ))}
            </div>
          )}
          {description && (
            <div className='space-y-1 border-t border-border/50 pt-4'>
              <p className='text-sm text-muted-foreground'>Descripción</p>
              <p>{description}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
