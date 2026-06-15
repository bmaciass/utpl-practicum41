import {
  DragDropProvider,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/react'
import { useEffect, useMemo, useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import type {
  ProjectTaskStatus,
  ProjectTask_UseProjectTaskListQuery,
} from '~/gql/graphql'
import { useProjectTaskList } from '~/hooks/projectTask/useProjectTaskList'
import { useUpdateProjectTask } from '~/hooks/projectTask/useUpdateProjectTask'
import { ProjectTaskDetailDialog } from './ProjectTaskDetailDialog'
import { ProjectTasksWrapper } from './ProjectTasksWrapper'
import {
  PROJECT_TASK_STATUS_GROUPS,
  type ProjectTaskRecord,
  isProjectTaskStatus,
  moveTaskToStatus,
} from './projectTaskBoard'

export const ProjectTasksSection = ({ projectUid }: { projectUid: string }) => {
  const { projectTasks, loading, error } = useProjectTaskList(projectUid)
  const { error: updateError, updateProjectTask } =
    useUpdateProjectTask(projectUid)
  const [tasks, setTasks] = useState<ProjectTaskRecord[]>([])
  const [selectedTask, setSelectedTask] = useState<
    | ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number]
    | null
  >(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dropTargetStatus, setDropTargetStatus] =
    useState<ProjectTaskStatus | null>(null)

  useEffect(() => {
    setTasks(projectTasks)
  }, [projectTasks])

  const taskMap = useMemo(
    () => new Map(tasks.map((task) => [task.uid, task])),
    [tasks],
  )

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
    const previousTasks = tasks
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.uid !== taskUid),
    )

    updateProjectTask({
      variables: {
        data: { active: false },
        where: { uid: taskUid },
      },
      onError: () => setTasks(previousTasks),
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const taskUid = event.operation.source?.id
    if (typeof taskUid !== 'string') {
      return
    }

    setDropTargetStatus(null)
  }

  const handleDragOver = (status: ProjectTaskStatus | null) => {
    setDropTargetStatus(status)
  }

  const resetDragState = () => {
    setDropTargetStatus(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const taskUid = event.operation.source?.id
    const nextStatus = event.operation.target?.id

    resetDragState()

    if (typeof taskUid !== 'string' || !isProjectTaskStatus(nextStatus)) {
      return
    }

    const task = taskMap.get(taskUid)
    if (!task || task.status === nextStatus) {
      return
    }

    const previousTasks = tasks
    setTasks((currentTasks) =>
      moveTaskToStatus(currentTasks, taskUid, nextStatus),
    )

    updateProjectTask({
      variables: {
        data: { status: nextStatus },
        where: { uid: taskUid },
      },
      onError: () => setTasks(previousTasks),
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

      {updateError ? (
        <Alert variant='error' description={updateError.message} />
      ) : null}

      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={(event) => {
          const targetId = event.operation.target?.id
          handleDragOver(
            typeof targetId === 'string' && isProjectTaskStatus(targetId)
              ? targetId
              : null,
          )
        }}
        onDragEnd={handleDragEnd}
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {PROJECT_TASK_STATUS_GROUPS.map((group) => (
            <ProjectTasksWrapper
              key={group.key}
              status={group.key}
              title={group.label}
              tasks={tasks.filter((task) => task.status === group.key)}
              onView={handleViewTask}
              onDelete={handleDeleteTask}
              isDropTarget={dropTargetStatus === group.key}
            />
          ))}
        </div>
      </DragDropProvider>

      <ProjectTaskDetailDialog
        projectUid={projectUid}
        task={
          selectedTask
            ? (taskMap.get(selectedTask.uid) ?? selectedTask)
            : selectedTask
        }
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
