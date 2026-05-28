import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

type Accent = 'destructive' | 'warning' | 'primary'

const ACCENT: Record<Accent, { text: string; bg: string }> = {
  destructive: { text: 'text-destructive', bg: 'bg-destructive/10' },
  warning: { text: 'text-warning', bg: 'bg-warning/10' },
  primary: { text: 'text-primary', bg: 'bg-primary/10' },
}

type KpiCardProps = {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  accent?: Accent
  loading?: boolean
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'primary',
  loading = false,
}: KpiCardProps) {
  const colors = ACCENT[accent]

  return (
    <Card className='flex flex-col'>
      <CardContent className='flex items-center gap-4 p-6'>
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            colors.bg,
          )}
        >
          <Icon className={cn('h-6 w-6', colors.text)} />
        </div>
        <div className='flex min-w-0 flex-col gap-1'>
          <span className='text-sm font-medium text-muted-foreground'>
            {title}
          </span>
          {loading ? (
            <Skeleton className='h-9 w-16' />
          ) : (
            <span
              className={cn('text-4xl font-bold leading-none', colors.text)}
            >
              {value}
            </span>
          )}
          {subtitle && (
            <span className='text-xs text-muted-foreground'>{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
