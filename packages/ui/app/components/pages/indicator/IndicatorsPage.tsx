import { Link, Outlet, useParams, useSearchParams } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { IndicatorListSection } from './IndicatorListSection'

export function IndicatorsPage() {
  const { institutionUid, objectiveUid, goalUid } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const deleteStatus = searchParams.get('deleted')

  if (!institutionUid || !objectiveUid || !goalUid) {
    return <Alert variant='error' description='IDs inválidos' />
  }

  return (
    <div className='grid grid-cols-6 gap-4'>
      <div className='col-span-3 col-start-1 p-4'>
        {deleteStatus === 'success' && (
          <Alert
            closable
            variant='success'
            description='Indicador eliminado exitosamente'
            onClose={() => setSearchParams({})}
          />
        )}
        <div className='flex items-center gap-2'>
          <div className='flex-none'>
            <Link
              to={`/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goalUid}`}
            >
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='grow'>
            <Title variant='h4'>Indicadores</Title>
          </div>
          <div className='flex-none'>
            <Link
              to={`/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goalUid}/indicators/new`}
            >
              <Button>Nuevo</Button>
            </Link>
          </div>
        </div>
        <div className='py-4'>
          <IndicatorListSection
            goalUid={goalUid}
            institutionUid={institutionUid}
            objectiveUid={objectiveUid}
          />
        </div>
      </div>
      <div className='col-span-3 col-start-4 p-4'>
        <Outlet />
      </div>
    </div>
  )
}
