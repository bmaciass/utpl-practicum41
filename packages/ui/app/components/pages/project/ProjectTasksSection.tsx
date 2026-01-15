import { useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import type { ProjectTask_UseProjectTaskListQuery } from '~/gql/graphql'
import { useProjectTaskList } from '~/hooks/projectTask/useProjectTaskList'
import { useUpdateProjectTask } from '~/hooks/projectTask/useUpdateProjectTask'
import { ProjectTaskDetailDialog } from './ProjectTaskDetailDialog'
import { ProjectTasksWrapper } from './ProjectTasksWrapper'

const STATUS_GROUPS = [
  { key: 'pending', label: 'Pendiente' },
  { key: 'in_progress', label: 'En Progreso' },
  { key: 'reviewing', label: 'En Revisión' },
  { key: 'done', label: 'Completado' },
  { key: 'cancelled', label: 'Cancelado' },
]

export const ProjectTasksSection = ({ projectUid }: { projectUid: string }) => {
  const { projectTasks, loading, error } = useProjectTaskList(projectUid)
  const { updateProjectTask } = useUpdateProjectTask(projectUid)
  const [selectedTask, setSelectedTask] = useState<
    | ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number]
    | null
  >(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleViewTask = (
    task: ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number],
  ) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleNewTask = () => {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  const handleDeleteTask = (taskUid: string) => {
    updateProjectTask({
      variables: {
        data: { active: false },
        where: { uid: taskUid },
      },
    })
  }

  if (loading) return <Skeleton className='h-64 w-full' />
  if (error) return <Alert variant='error' description={error.message} />

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Tareas del Proyecto</h2>
        <Button onClick={handleNewTask}>Nueva Tarea</Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
        {STATUS_GROUPS.map((group) => (
          <ProjectTasksWrapper
            key={group.key}
            title={group.label}
            tasks={projectTasks.filter((task) => task.status === group.key)}
            onView={handleViewTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      <ProjectTaskDetailDialog
        projectId={projectUid}
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
