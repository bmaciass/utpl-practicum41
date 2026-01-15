import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import type { ProjectTask_UseProjectTaskListQuery } from '~/gql/graphql'
import { ProjectTaskForm } from './ProjectTaskForm'

export const ProjectTaskDetailDialog = ({
  projectId,
  task,
  open,
  onOpenChange,
}: {
  projectId: string
  task:
    | ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number]
    | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{task ? task.name : 'Nueva Tarea'}</DialogTitle>
        </DialogHeader>
        <ProjectTaskForm
          projectId={projectId}
          task={task}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
