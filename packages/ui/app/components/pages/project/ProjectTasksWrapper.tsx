import { useDroppable } from '@dnd-kit/react'
import type { ProjectTaskStatus } from '~/gql/graphql'
import { cn } from '~/lib/utils'
import { ProjectTaskCard } from './ProjectTaskCard'
import {
  PROJECT_TASK_DRAG_TYPE,
  type ProjectTaskRecord,
} from './projectTaskBoard'

export const ProjectTasksWrapper = ({
  status,
  title,
  tasks,
  onView,
  onDelete,
  isDropTarget,
}: {
  status: ProjectTaskStatus
  title: string
  tasks: ProjectTaskRecord[]
  onView: (task: ProjectTaskRecord) => void
  onDelete: (taskUid: string) => void
  isDropTarget?: boolean
}) => {
  const { ref, isDropTarget: isDroppableActive } = useDroppable({
    id: status,
    accept: PROJECT_TASK_DRAG_TYPE,
  })

  const highlighted = isDropTarget ?? isDroppableActive

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>
        {title} ({tasks.length})
      </h3>
      <div
        ref={ref}
        className={cn(
          'min-h-32 space-y-2 rounded-2xl border border-transparent bg-muted/20 p-3 transition-colors',
          highlighted && 'border-primary/50 bg-primary/5',
        )}
      >
        {tasks.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No hay tareas</p>
        ) : (
          tasks.map((task) => (
            <ProjectTaskCard
              key={task.uid}
              task={task}
              onView={onView}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
