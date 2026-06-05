import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { ProjectTaskStatus } from '~/gql/graphql'
import { useProjectTaskList } from '~/hooks/projectTask/useProjectTaskList'

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 1,
  }).format(value)
}

export const ProjectTaskCompletionMetric = ({
  projectUid,
}: {
  projectUid: string
}) => {
  const { projectTasks, loading, error } = useProjectTaskList(projectUid)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tareas completadas</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-4 w-40' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tareas completadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-destructive'>
            No se pudo cargar el porcentaje.
          </p>
        </CardContent>
      </Card>
    )
  }

  const actionableTasks = projectTasks.filter(
    (task) => task.status !== ProjectTaskStatus.Cancelled,
  )
  const completedTasks = actionableTasks.filter(
    (task) => task.status === ProjectTaskStatus.Done,
  )

  const total = actionableTasks.length
  const completed = completedTasks.length
  const percentage = total === 0 ? 0 : (completed / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas completadas</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='text-4xl font-semibold'>
          {formatPercent(percentage)}%
        </div>
        <p className='text-sm text-muted-foreground'>
          {completed} de {total} tareas completadas
        </p>
      </CardContent>
    </Card>
  )
}
