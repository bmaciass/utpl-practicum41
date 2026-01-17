import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Alert, AlertDescription } from '~/components/ui/alert'
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
import type { ObjectivePnd } from '~/gql/graphql'
import { usePNDCreate } from '~/hooks/pnd/usePNDCreate'
import { usePNDUpdate } from '~/hooks/pnd/usePNDUpdate'

const pndFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
})

type PNDFormValues = z.infer<typeof pndFormSchema>

interface PNDFormProps {
  objective?: ObjectivePnd
  onCancel: () => void
  onSuccess?: (objective: ObjectivePnd) => void
}

export function PNDForm({ objective, onCancel, onSuccess }: PNDFormProps) {
  const { createPND, loading: creating, error: createError } = usePNDCreate()
  const { updatePND, loading: updating, error: updateError } = usePNDUpdate()

  const mutationError = createError ?? updateError
  const isSubmitting = creating || updating

  const form = useForm<PNDFormValues>({
    resolver: zodResolver(pndFormSchema),
    defaultValues: {
      name: objective?.name ?? '',
      description: objective?.description ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: objective?.name ?? '',
      description: objective?.description ?? '',
    })
  }, [form, objective])

  const handleSubmit = async (values: PNDFormValues) => {
    const result = objective
      ? await updatePND(objective.uid, values)
      : await createPND(values)

    if (result && onSuccess) {
      onSuccess(result)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        {mutationError && (
          <Alert variant='destructive'>
            <AlertDescription>
              {mutationError.message ?? 'Error al guardar el objetivo PND'}
            </AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Objetivo</FormLabel>
              <FormControl>
                <Input
                  placeholder='Ej: Objetivo 1: Desarrollo Sostenible'
                  {...field}
                />
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
                <Textarea
                  placeholder='Descripción detallada del objetivo...'
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : objective ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
