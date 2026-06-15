import {
  ProjectTaskStatus,
  type ProjectTask_UseProjectTaskListQuery,
} from '~/gql/graphql'

export type ProjectTaskRecord =
  ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number]

export const PROJECT_TASK_DRAG_TYPE = 'project-task'

export const PROJECT_TASK_STATUS_GROUPS: Array<{
  key: ProjectTaskStatus
  label: string
}> = [
  { key: ProjectTaskStatus.Pending, label: 'Pendiente' },
  { key: ProjectTaskStatus.InProgress, label: 'En Progreso' },
  { key: ProjectTaskStatus.Reviewing, label: 'En Revisión' },
  { key: ProjectTaskStatus.Done, label: 'Completado' },
  { key: ProjectTaskStatus.Cancelled, label: 'Cancelado' },
]

export function isProjectTaskStatus(
  value: string | number | null | undefined,
): value is ProjectTaskStatus {
  if (!value) {
    return false
  }

  return PROJECT_TASK_STATUS_GROUPS.some((group) => group.key === value)
}

export function moveTaskToStatus(
  tasks: ProjectTaskRecord[],
  taskUid: string,
  status: ProjectTaskStatus,
) {
  const task = tasks.find((record) => record.uid === taskUid)
  if (!task || task.status === status) {
    return tasks
  }

  return [
    ...tasks.filter((record) => record.uid !== taskUid),
    { ...task, status },
  ]
}
