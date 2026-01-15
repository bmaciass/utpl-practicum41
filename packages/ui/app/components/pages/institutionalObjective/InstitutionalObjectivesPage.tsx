import { Link, Outlet, useParams } from '@remix-run/react'
import { isEmpty } from 'lodash-es'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useInstitutionalObjectiveList } from '~/hooks/institutionalObjective/useInstitutionalObjectiveList'
import { InstitutionalObjectiveList } from './InstitutionalObjectiveList'

const InstitutionalObjectivesSection = (props: { institutionUid: string }) => {
  const { institutionUid } = props
  const { list, error, loading } = useInstitutionalObjectiveList({
    institutionUid,
    active: true,
  })

  if (loading) {
    return <Skeleton className='h-full w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Objetivos Institucionales. Error: ${error.cause?.message ?? error.message}`}
      />
    )
  }

  if (isEmpty(list)) {
    return <Paragraph>No hay objetivos institucionales creados</Paragraph>
  }

  return (
    <div className='py-4'>
      <InstitutionalObjectiveList list={list} institutionUid={institutionUid} />
    </div>
  )
}

export const InstitutionalObjectivesPage = () => {
  const params = useParams()
  const institutionUid = params.institutionUid

  if (!institutionUid) {
    return (
      <Alert variant='error' description='ID de institución no encontrado' />
    )
  }

  return (
    <div className='grid grid-cols-6 gap-4'>
      <div className='col-span-3 col-start-1 p-4'>
        <div className='flex items-center gap-2'>
          <div className='flex-none'>
            <Link to={`/institutions/${institutionUid}`}>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='grow'>
            <Title variant='h4'>Objetivos Institucionales</Title>
          </div>
          <div className='flex-none'>
            <Link to={`/institutions/${institutionUid}/objectives/new`}>
              <Button>Nuevo</Button>
            </Link>
          </div>
        </div>
        <InstitutionalObjectivesSection institutionUid={institutionUid} />
      </div>
      <div className='col-span-3 col-start-4 p-4'>
        <Outlet />
      </div>
    </div>
  )
}
