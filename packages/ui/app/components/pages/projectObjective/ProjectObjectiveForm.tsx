import { zodResolver } from '@hookform/resolvers/zod'
import { omit } from 'lodash-es'
import { useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'
import { ProjectTaskStatusSelect } from '~/components/selects/ProjectTaskStatusSelect'
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
import type {
  ProjectObjective_useGetProjectObjectiveQuery,
  ProjectObjective_useProjectObjectiveListQuery,
} from '~/gql/graphql'
import { useCreateProjectObjective } from '~/hooks/projectObjective/useCreateProjectObjective'
import { useDeleteProjectObjective } from '~/hooks/projectObjective/useDeleteProjectObjective'
import { useUpdateProjectObjective } from '~/hooks/projectObjective/useUpdateProjectObjective'

type ProjectObjectiveRecord =
  | NonNullable<
      ProjectObjective_useGetProjectObjectiveQuery['projectObjective']['one']
    >
  | ProjectObjective_useProjectObjectiveListQuery['projectObjective']['list']['records'][number]

const schema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  status: z.enum(['pending', 'in_progress', 'reviewing', 'done', 'cancelled']),
})

export function ProjectObjectiveForm(props: {
  objective?: ProjectObjectiveRecord | null
  programUid: string
  projectUid: string
  disabled?: boolean
}) {
  const { objective, programUid, projectUid, disabled } = props
  const shouldUpdate = Boolean(objective)
  const navigate = useNavigate()

  const {
    createProjectObjective,
    loading: creating,
    error: createError,
  } = useCreateProjectObjective()
  const {
    updateProjectObjective,
    loading: updating,
    error: updateError,
  } = useUpdateProjectObjective()
  const {
    deleteProjectObjective,
    loading: deleting,
    error: deleteError,
  } = useDeleteProjectObjective()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: objective?.name ?? '',
      status: objective?.status ?? 'pending',
    },
  })

  useEffect(() => {
    form.reset({
      name: objective?.name ?? '',
      status: objective?.status ?? 'pending',
    })
  }, [form, objective])

  const mutationError = createError ?? updateError ?? deleteError
  const loading = creating || updating || deleting
  const isDisabled = disabled || loading

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    if (shouldUpdate && objective) {
      await updateProjectObjective(objective.uid, {
        name: values.name,
        status: values.status,
      })
      return
    }

    const created = await createProjectObjective({
      name: values.name,
      status: values.status,
      projectUid,
    })

    if (created) {
      navigate(
        `/programs/${programUid}/projects/${projectUid}/objectives/${created.uid}`,
      )
    }
  }

  const handleDelete = async () => {
    if (!objective) return
    const confirmed = window.confirm(
      'Esta seguro que desea eliminar este objetivo?',
    )
    if (!confirmed) return
    await deleteProjectObjective(objective.uid)
    navigate(
      `/programs/${programUid}/projects/${projectUid}/objectives?deleted=success`,
    )
  }

  const handleCancel = () => {
    navigate(`/programs/${programUid}/projects/${projectUid}/objectives`)
  }

  return (
    <div className='flex flex-col gap-3'>
      {mutationError && (
        <Alert
          closable
          variant='error'
          description={mutationError.cause?.message ?? mutationError.message}
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input className='w-full' {...field} disabled={isDisabled} />
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
                    disabled={isDisabled}
                    {...omit(field, 'onChange')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex gap-2'>
            <Button
              variant='secondary'
              type='button'
              onClick={handleCancel}
              disabled={isDisabled}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isDisabled}>
              {loading ? 'Guardando...' : shouldUpdate ? 'Actualizar' : 'Crear'}
            </Button>
            {shouldUpdate && (
              <Button
                variant='destructive'
                type='button'
                onClick={handleDelete}
                disabled={isDisabled}
              >
                Eliminar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
