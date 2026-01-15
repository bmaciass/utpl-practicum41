import { ProjectTaskCard } from './ProjectTaskCard'
import type { ProjectTask_UseProjectTaskListQuery } from '~/gql/graphql'

export const ProjectTasksWrapper = ({
  title,
  tasks,
  onView,
  onDelete,
}: {
  title: string
  tasks: ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records']
  onView: (
    task: ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number],
  ) => void
  onDelete: (taskUid: string) => void
}) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>
        {title} ({tasks.length})
      </h3>
      <div className='space-y-2'>
        {tasks.length === 0 ? (
          <p className='text-sm text-gray-500'>No hay tareas</p>
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
