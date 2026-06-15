import { useDraggable } from '@dnd-kit/react'
import { MoreVertical } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardHeader } from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { formatDateRange } from '~/lib/dateUtils'
import { cn } from '~/lib/utils'
import {
  PROJECT_TASK_DRAG_TYPE,
  type ProjectTaskRecord,
} from './projectTaskBoard'

export const ProjectTaskCard = ({
  task,
  onView,
  onDelete,
  isDragDisabled = false,
}: {
  task: ProjectTaskRecord
  onView: (task: ProjectTaskRecord) => void
  onDelete: (taskUid: string) => void
  isDragDisabled?: boolean
}) => {
  const { ref, isDragging } = useDraggable({
    id: task.uid,
    type: PROJECT_TASK_DRAG_TYPE,
    data: {
      taskUid: task.uid,
      status: task.status,
    },
    disabled: isDragDisabled,
  })

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
      ref={ref}
      className={cn(
        'cursor-pointer transition-all hover:bg-accent/35',
        isDragging && 'opacity-60 ring-2 ring-primary/30 shadow-lg',
      )}
      onClick={() => onView(task)}
    >
      <CardHeader className='p-3'>
        <div className='flex justify-between items-start gap-2'>
          <div className='flex-1 min-w-0'>
            <h4 className='text-sm font-semibold truncate'>{task.name}</h4>
            <div className='mt-1 text-xs text-muted-foreground'>
              {task.responsible?.name || 'Sin asignar'}
            </div>
            {(task.startDate || task.endDate) && (
              <div className='mt-1 text-xs text-muted-foreground/80'>
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
              <DropdownMenuItem
                onClick={handleDelete}
                className='text-destructive'
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  )
}
