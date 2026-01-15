import { zodResolver } from '@hookform/resolvers/zod'
import { omit } from 'lodash-es'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'
import { ProjectTaskStatusSelect } from '~/components/selects/ProjectTaskStatusSelect'
import { UserSelect } from '~/components/selects/UserSelect'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
  ProjectTaskStatus,
  type ProjectTask_UseProjectTaskListQuery,
} from '~/gql/graphql'
import { useCreateProjectTask } from '~/hooks/projectTask/useCreateProjectTask'
import { useUpdateProjectTask } from '~/hooks/projectTask/useUpdateProjectTask'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nombre debe tener al menos dos caracteres',
  }),
  description: z.string().optional(),
  status: z.enum([
    ProjectTaskStatus.Pending,
    ProjectTaskStatus.InProgress,
    ProjectTaskStatus.Reviewing,
    ProjectTaskStatus.Done,
    ProjectTaskStatus.Cancelled,
  ]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibleUid: z.string().min(1, {
    message: 'Responsable es requerido',
  }),
})

export function ProjectTaskForm({
  projectId,
  task,
  onSuccess,
  onCancel,
}: {
  projectId: string
  task?:
    | ProjectTask_UseProjectTaskListQuery['projectTask']['list']['records'][number]
    | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const isEditMode = !!task

  const {
    createProjectTask,
    loading: createLoading,
    error: createError,
  } = useCreateProjectTask(projectId)
  const {
    updateProjectTask,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProjectTask(projectId)

  const loading = createLoading || updateLoading
  const error = createError || updateError

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: task?.name || '',
      description: task?.description || '',
      status: task?.status || ProjectTaskStatus.Pending,
      startDate: task?.startDate
        ? new Date(task.startDate).toISOString().split('T')[0]
        : '',
      endDate: task?.endDate
        ? new Date(task.endDate).toISOString().split('T')[0]
        : '',
      responsibleUid: task?.responsible?.uid || '',
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        name: task.name,
        description: task.description || '',
        status: task.status,
        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split('T')[0]
          : '',
        endDate: task.endDate
          ? new Date(task.endDate).toISOString().split('T')[0]
          : '',
        responsibleUid: task.responsible?.uid || '',
      })
    }
  }, [form, task])

  const handleDelete = () => {
    if (!task) return

    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar esta tarea?',
    )
    if (confirmed) {
      updateProjectTask({
        variables: {
          data: { active: false },
          where: { uid: task.uid },
        },
        onCompleted: onSuccess,
      })
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
    }

    if (isEditMode && task) {
      updateProjectTask({
        variables: {
          data,
          where: { uid: task.uid },
        },
        onCompleted: onSuccess,
      })
    } else {
      createProjectTask({
        variables: {
          data: {
            ...data,
            projectId,
          },
        },
        onCompleted: onSuccess,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {error && (
          <Alert
            closable
            variant='error'
            description={error.cause?.message ?? error.message}
          />
        )}

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la tarea</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <ProjectTaskStatusSelect
                  onValueChange={field.onChange}
                  {...omit(field, 'onChange')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='startDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='endDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de fin</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='responsibleUid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable</FormLabel>
              <FormControl>
                <UserSelect
                  onValueChange={field.onChange}
                  {...omit(field, 'onChange')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-between pt-4'>
          {isEditMode ? (
            <Button
              type='button'
              variant='destructive'
              onClick={handleDelete}
              disabled={loading}
            >
              Eliminar
            </Button>
          ) : (
            <div />
          )}
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              {isEditMode ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
