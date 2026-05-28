import { X } from 'lucide-react'
import { InstitutionSelect } from '~/components/selects/InstitutionSelect'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export type ReportsFilters = {
  institutionUid?: string
  referenceDate?: string
}

type Props = {
  filters: ReportsFilters
  onChange: (filters: ReportsFilters) => void
}

export function ReportsFilterBar({ filters, onChange }: Props) {
  const hasFilters = Boolean(filters.institutionUid || filters.referenceDate)

  return (
    <div className='flex flex-wrap items-end gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-primary/5'>
      <div className='flex min-w-[220px] flex-1 flex-col gap-1.5'>
        <label className='text-sm font-medium text-muted-foreground'>
          Institución
        </label>
        <InstitutionSelect
          value={filters.institutionUid ?? ''}
          onValueChange={(institutionUid) =>
            onChange({ ...filters, institutionUid })
          }
          placeholder='Todas las instituciones'
        />
      </div>

      <div className='flex min-w-[180px] flex-col gap-1.5'>
        <label className='text-sm font-medium text-muted-foreground'>
          Fecha de referencia
        </label>
        <Input
          type='date'
          value={filters.referenceDate ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              referenceDate: event.target.value || undefined,
            })
          }
        />
      </div>

      {hasFilters && (
        <Button
          variant='ghost'
          onClick={() => onChange({})}
          className='gap-1.5'
        >
          <X className='h-4 w-4' />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
