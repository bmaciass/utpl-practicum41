import { MoreVertical } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardHeader } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { ProjectTask_UseProjectTaskListQuery } from '~/gql/graphql'
import { formatDateRange } from '~/lib/dateUtils'

export const ProjectTaskCard = ({
  task,
  onView,
  onDelete,
}: {
  task: ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number]
  onView: (
    task: ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number],
  ) => void
  onDelete: (taskUid: string) => void
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar esta tarea?',
    )
    if (confirmed) {
      onDelete(task.uid)
    }
  }

  return (
    <Card
      className='cursor-pointer hover:bg-gray-50 transition-colors'
      onClick={() => onView(task)}
    >
      <CardHeader className='p-3'>
        <div className='flex justify-between items-start gap-2'>
          <div className='flex-1 min-w-0'>
            <h4 className='text-sm font-semibold truncate'>{task.name}</h4>
            <div className='text-xs text-gray-600 mt-1'>
              {task.responsible?.name || 'Sin asignar'}
            </div>
            {(task.startDate || task.endDate) && (
              <div className='text-xs text-gray-500 mt-1'>
                {formatDateRange(task.startDate, task.endDate)}
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 flex-shrink-0'
              >
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  )
}
