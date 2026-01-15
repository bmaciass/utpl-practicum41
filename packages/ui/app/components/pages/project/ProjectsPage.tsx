import { Link, Outlet, useParams, useSearchParams } from '@remix-run/react'
import { isEmpty } from 'lodash-es'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useProjectList } from '~/hooks/project/useProjectList'
import { ProjectList } from './ProjectList'

const ProjectsSection = ({ programUid }: { programUid: string }) => {
  const { projects, error, loading } = useProjectList(programUid)

  if (loading) {
    return <Skeleton className='h-full w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Proyectos. Error: ${error.message}`}
      />
    )
  }

  if (isEmpty(projects)) {
    return <Paragraph>No hay proyectos creados</Paragraph>
  }

  return (
    <div className='py-4'>
      <ProjectList list={projects} />
    </div>
  )
}

export const ProjectsPage = () => {
  const { programUid } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const deleteStatus = searchParams.get('deleted')

  if (!programUid) {
    return <Alert variant='error' description='ID de programa no encontrado' />
  }

  return (
    <div className='grid grid-cols-8 gap-4'>
      <div className='col-span-2 col-start-1 p-4'>
        {deleteStatus === 'success' && (
          <Alert
            closable
            variant='success'
            description='Proyecto eliminado exitosamente'
            onClose={() => setSearchParams({})}
          />
        )}
        <div className='flex items-center gap-2'>
          <div className='flex-none'>
            <Link to={`/programs/${programUid}`}>
              <Button variant='ghost' size='icon'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='grow'>
            <Title variant='h4'>Proyectos</Title>
          </div>
          <div className='flex-none'>
            <Link to={`/programs/${programUid}/projects/new`}>
              <Button>Nuevo</Button>
            </Link>
          </div>
        </div>
        <ProjectsSection programUid={programUid} />
      </div>
      <div className='col-span-6 col-start-3 p-4'>
        <Outlet />
      </div>
    </div>
  )
}
