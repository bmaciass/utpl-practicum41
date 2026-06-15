import { useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { Skeleton } from '~/components/ui/skeleton'
import { useRegisterBreadcrumbName } from '~/context/BreadcrumbNames'
import { useGetProgram } from '~/hooks/program/useGetProgram'
import { useGetProject } from '~/hooks/project/useGetProject'
import { ProjectCompletionMetric } from './ProjectCompletionMetric'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectTaskCompletionMetric } from './ProjectTaskCompletionMetric'
import { ProjectTasksSection } from './ProjectTasksSection'

export const ProjectDetailPage = () => {
  const { projectUid, programUid } = useParams()

  if (!projectUid || !programUid) {
    throw new Error('Invalid parameters')
  }

  const { error, loading, project } = useGetProject(projectUid)
  const { program } = useGetProgram(programUid)
  useRegisterBreadcrumbName(programUid, program?.name)
  useRegisterBreadcrumbName(projectUid, project?.name)

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
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <ProjectCompletionMetric projectUid={projectUid} />
        <ProjectTaskCompletionMetric projectUid={projectUid} />
      </div>
      <ProjectDetailsSection
        project={project}
        programUid={programUid}
        projectUid={projectUid}
      />
      <ProjectTasksSection projectUid={projectUid} />
    </div>
  )
}
