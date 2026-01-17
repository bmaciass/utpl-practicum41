import { Link, Outlet, useParams, useSearchParams } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { GoalListSection } from './GoalListSection'

export function GoalsPage() {
  const { institutionUid, objectiveUid } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const deleteStatus = searchParams.get('deleted')

  if (!institutionUid || !objectiveUid) {
    return <Alert variant='error' description='IDs inválidos' />
  }

  return (
    <div className='grid grid-cols-6 gap-4'>
      <div className='col-span-3 col-start-1 p-4'>
        {deleteStatus === 'success' && (
          <Alert
            closable
            variant='success'
            description='Meta eliminada exitosamente'
            onClose={() => setSearchParams({})}
          />
        )}
        <div className='flex items-center gap-2'>
          <div className='flex-none'>
            <Link
              to={`/institutions/${institutionUid}/objectives/${objectiveUid}`}
            >
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='grow'>
            <Title variant='h4'>Metas</Title>
          </div>
          <div className='flex-none'>
            <Link
              to={`/institutions/${institutionUid}/objectives/${objectiveUid}/goals/new`}
            >
              <Button>Nuevo</Button>
            </Link>
          </div>
        </div>
        <div className='py-4'>
          <GoalListSection
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
