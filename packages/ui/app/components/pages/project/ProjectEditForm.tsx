import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@remix-run/react'
import { omit } from 'lodash-es'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'
import { ProjectStatusSelect } from '~/components/selects/ProjectStatusSelect'
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
  type GetProjects_UseGetProjectQuery,
  ProjectStatus,
} from '~/gql/graphql'
import { useUpdateProject } from '~/hooks/project/useUpdateProject'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nombre debe tener al menos dos caracteres',
  }),
  description: z.string().optional(),
  status: z.enum(ProjectStatus),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibleId: z.string().min(1, {
    message: 'Responsable es requerido',
  }),
})

export function ProjectEditForm({
  project,
  onSuccess,
  onCancel,
}: {
  project: GetProjects_UseGetProjectQuery['project']['one']
  onSuccess: () => void
  onCancel: () => void
}) {
  const { programUid } = useParams()
  const navigate = useNavigate()

  const { updateProject, loading, error } = useUpdateProject()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || ProjectStatus.Pending,
      startDate: project?.startDate
        ? new Date(project.startDate).toISOString().split('T')[0]
        : '',
      endDate: project?.endDate
        ? new Date(project.endDate).toISOString().split('T')[0]
        : '',
      responsibleId: project?.responsible?.uid || '',
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split('T')[0]
          : '',
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split('T')[0]
          : '',
        responsibleId: project.responsible?.uid || '',
      })
    }
  }, [form, project])

  const handleDelete = () => {
    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar este proyecto?',
    )
    if (confirmed && project) {
      updateProject({
        variables: {
          data: { active: false },
          where: { uid: project.uid },
        },
        onCompleted: () => {
          navigate(`/programs/${programUid}/projects?deleted=success`)
        },
      })
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!project) return

    updateProject({
      variables: {
        data: {
          ...values,
          startDate: values.startDate || null,
          endDate: values.endDate || null,
        },
        where: { uid: project.uid },
      },
      onCompleted: onSuccess,
    })
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
              <FormLabel>Nombre del proyecto</FormLabel>
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
                <ProjectStatusSelect
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
          name='responsibleId'
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
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            Eliminar
          </Button>
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
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
