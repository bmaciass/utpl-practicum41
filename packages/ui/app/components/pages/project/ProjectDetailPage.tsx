import { useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetProject } from '~/hooks/project/useGetProject'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectTasksSection } from './ProjectTasksSection'

export const ProjectDetailPage = () => {
  const { projectUid, programUid } = useParams()

  if (!projectUid || !programUid) {
    throw new Error('Invalid parameters')
  }

  const { error, loading, project } = useGetProject(projectUid)

  if (loading) return <Skeleton className='w-full h-96' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={error.cause?.message ?? error.message}
      />
    )
  }

  if (!project) {
    return <Alert variant='error' description='Proyecto no encontrado' />
  }

  return (
    <div className='space-y-8'>
      <ProjectDetailsSection project={project} />
      <ProjectTasksSection projectUid={projectUid} />
    </div>
  )
}
