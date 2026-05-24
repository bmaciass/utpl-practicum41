import { Link } from '@remix-run/react'
import { capitalize } from 'lodash-es'
import { type FormEvent, useMemo, useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { withAuth } from '~/helpers/withAuth'
import { useInstitutionList } from '~/hooks/institution/useInstitutionList'
import { useProgramList } from '~/hooks/program/useProgramList'
import { ProgramList } from '~/components/pages/program/ProgramList'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const ALL_VALUE = 'all'

type ProgramFilterForm = { institutionUid: string }
const EMPTY_FILTERS: ProgramFilterForm = { institutionUid: '' }

const ProgramsSection = ({ institutionUid }: { institutionUid?: string }) => {
  const { programs, error, loading } = useProgramList(
    institutionUid ? { institutionUid } : undefined,
  )

  if (loading) return <Skeleton className='h-full w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Programas. Error: ${error.message}`}
      />
    )
  }

  if (programs.length === 0) {
    return <Paragraph>No hay programas para los filtros seleccionados</Paragraph>
  }

  return (
    <div className='py-4'>
      <ProgramList list={programs} />
    </div>
  )
}

const ProgramsPage = () => {
  const [draftFilters, setDraftFilters] = useState<ProgramFilterForm>(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<ProgramFilterForm>(EMPTY_FILTERS)

  const { institutions } = useInstitutionList()

  const institutionUid = useMemo(
    () => appliedFilters.institutionUid || undefined,
    [appliedFilters],
  )

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedFilters(draftFilters)
  }

  const handleClearFilters = () => {
    setDraftFilters(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
  }

  return (
    <div className='space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <Title variant='h4'>Programas</Title>
        <Link to='/programs/new'>
          <Button>Nuevo</Button>
        </Link>
      </div>

      <form
        className='grid grid-cols-1 gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-3'
        onSubmit={handleApplyFilters}
      >
        <div className='space-y-2'>
          <Paragraph className='text-left text-sm font-medium leading-none'>
            Institución
          </Paragraph>
          <Select
            value={draftFilters.institutionUid || ALL_VALUE}
            onValueChange={(value) =>
              setDraftFilters({ institutionUid: value === ALL_VALUE ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Todas' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todas</SelectItem>
              {institutions.map(({ uid, name }) => (
                <SelectItem key={uid} value={uid}>
                  {capitalize(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-end gap-2 md:col-span-2'>
          <Button type='submit'>Aplicar filtros</Button>
          <Button type='button' variant='secondary' onClick={handleClearFilters}>
            Limpiar
          </Button>
        </div>
      </form>

      <ProgramsSection institutionUid={institutionUid} />
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <ProgramsPage />}</ClientOnly>
}
