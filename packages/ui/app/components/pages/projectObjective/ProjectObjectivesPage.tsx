import { Link, Outlet, useParams, useSearchParams } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { ProjectObjectiveListSection } from './ProjectObjectiveListSection'

export function ProjectObjectivesPage() {
  const { programUid, projectUid } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const deleteStatus = searchParams.get('deleted')

  if (!programUid || !projectUid) {
    return <Alert variant='error' description='IDs invalidos' />
  }

  return (
    <div className='grid grid-cols-6 gap-4'>
      <div className='col-span-3 col-start-1 p-4'>
        {deleteStatus === 'success' && (
          <Alert
            closable
            variant='success'
            description='Objetivo eliminado exitosamente'
            onClose={() => setSearchParams({})}
          />
        )}
        <div className='flex items-center gap-2'>
          <div className='flex-none'>
            <Link to={`/programs/${programUid}/projects/${projectUid}`}>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='grow'>
            <Title variant='h4'>Objetivos del proyecto</Title>
            <Paragraph className='text-xs text-muted-foreground'>
              Gestiona objetivos y alinea con ODS.
            </Paragraph>
          </div>
          <div className='flex-none'>
            <Link
              to={`/programs/${programUid}/projects/${projectUid}/objectives/new`}
            >
              <Button>Nuevo</Button>
            </Link>
          </div>
        </div>
        <div className='py-4'>
          <ProjectObjectiveListSection
            programUid={programUid}
            projectUid={projectUid}
          />
        </div>
      </div>
      <div className='col-span-3 col-start-4 p-4'>
        <Outlet />
      </div>
    </div>
  )
}
