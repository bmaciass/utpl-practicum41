import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'
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
import type { Goal_UseGetGoalQuery, Goal_UseGoalListQuery } from '~/gql/graphql'
import { useCreateGoal } from '~/hooks/goal/useCreateGoal'
import { useDeleteGoal } from '~/hooks/goal/useDeleteGoal'
import { useUpdateGoal } from '~/hooks/goal/useUpdateGoal'

type GoalRecord =
  | NonNullable<Goal_UseGetGoalQuery['goal']['one']>
  | Goal_UseGoalListQuery['goal']['list']['records'][number]

const schema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  description: z
    .string()
    .min(4, 'Descripción debe tener al menos 4 caracteres'),
})

export function GoalForm(props: {
  goal?: GoalRecord | null
  institutionUid: string
  objectiveUid: string
}) {
  const { goal, institutionUid, objectiveUid } = props
  const shouldUpdate = Boolean(goal)
  const navigate = useNavigate()

  const { createGoal, loading: creating, error: createError } = useCreateGoal()
  const { updateGoal, loading: updating, error: updateError } = useUpdateGoal()
  const { deleteGoal, loading: deleting, error: deleteError } = useDeleteGoal()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: goal?.name ?? '',
      description: goal?.description ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: goal?.name ?? '',
      description: goal?.description ?? '',
    })
  }, [form, goal])

  const mutationError = createError ?? updateError ?? deleteError
  const loading = creating || updating || deleting

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    if (shouldUpdate && goal) {
      await updateGoal(goal.uid, {
        name: values.name,
        description: values.description,
      })
      return
    }

    const created = await createGoal({
      name: values.name,
      description: values.description,
      institutionalObjectiveUid: objectiveUid,
    })

    if (created) {
      navigate(
        `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${created.uid}`,
      )
    }
  }

  const handleDelete = async () => {
    if (!goal) return
    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar esta meta?',
    )
    if (!confirmed) return
    await deleteGoal(goal.uid)
    navigate(
      `/institutions/${institutionUid}/objectives/${objectiveUid}/goals?deleted=success`,
    )
  }

  const handleCancel = () => {
    navigate(`/institutions/${institutionUid}/objectives/${objectiveUid}/goals`)
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
                  <Input className='w-full' {...field} />
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
                  <Textarea rows={4} className='w-full' {...field} />
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Guardando...' : shouldUpdate ? 'Actualizar' : 'Crear'}
            </Button>
            {shouldUpdate && (
              <Button
                variant='destructive'
                type='button'
                onClick={handleDelete}
                disabled={loading}
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
