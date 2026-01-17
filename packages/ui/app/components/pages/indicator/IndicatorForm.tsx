import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@remix-run/react'
import { omit } from 'lodash-es'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'
import { IndicatorTypeSelect } from '~/components/selects/IndicatorTypeSelect'
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
import { IndicatorType } from '~/gql/graphql'
import type {
  Indicator_UseGetIndicatorQuery,
  Indicator_UseIndicatorListQuery,
} from '~/gql/graphql'
import { useCreateIndicator } from '~/hooks/indicator/useCreateIndicator'
import { useDeleteIndicator } from '~/hooks/indicator/useDeleteIndicator'
import { useUpdateIndicator } from '~/hooks/indicator/useUpdateIndicator'

type IndicatorRecord =
  | NonNullable<Indicator_UseGetIndicatorQuery['indicator']['one']>
  | Indicator_UseIndicatorListQuery['indicator']['list']['records'][number]

const schema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  type: z.nativeEnum(IndicatorType).optional(),
  unitType: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
})

const parseNumber = (value?: string) => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const normalizeText = (value?: string) => {
  const trimmed = value?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : null
}

export function IndicatorForm(props: {
  indicator?: IndicatorRecord | null
  institutionUid: string
  objectiveUid: string
  goalUid: string
}) {
  const { indicator, institutionUid, objectiveUid, goalUid } = props
  const shouldUpdate = Boolean(indicator)
  const navigate = useNavigate()

  const {
    createIndicator,
    loading: creating,
    error: createError,
  } = useCreateIndicator()
  const {
    updateIndicator,
    loading: updating,
    error: updateError,
  } = useUpdateIndicator()
  const {
    deleteIndicator,
    loading: deleting,
    error: deleteError,
  } = useDeleteIndicator()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: indicator?.name ?? '',
      description: indicator?.description ?? '',
      type: indicator?.type ?? undefined,
      unitType: indicator?.unitType ?? '',
      minValue:
        indicator?.minValue !== null && indicator?.minValue !== undefined
          ? String(indicator.minValue)
          : '',
      maxValue:
        indicator?.maxValue !== null && indicator?.maxValue !== undefined
          ? String(indicator.maxValue)
          : '',
    },
  })

  useEffect(() => {
    form.reset({
      name: indicator?.name ?? '',
      description: indicator?.description ?? '',
      type: indicator?.type ?? undefined,
      unitType: indicator?.unitType ?? '',
      minValue:
        indicator?.minValue !== null && indicator?.minValue !== undefined
          ? String(indicator.minValue)
          : '',
      maxValue:
        indicator?.maxValue !== null && indicator?.maxValue !== undefined
          ? String(indicator.maxValue)
          : '',
    })
  }, [form, indicator])

  const mutationError = createError ?? updateError ?? deleteError
  const loading = creating || updating || deleting

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    const payload = {
      name: values.name.trim(),
      description: normalizeText(values.description),
      type: values.type ?? null,
      unitType: normalizeText(values.unitType),
      minValue: parseNumber(values.minValue),
      maxValue: parseNumber(values.maxValue),
    }

    if (shouldUpdate && indicator) {
      await updateIndicator(indicator.uid, payload)
      return
    }

    const created = await createIndicator({
      ...payload,
      goalUid,
    })

    if (created) {
      navigate(
        `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goalUid}/indicators/${created.uid}`,
      )
    }
  }

  const handleDelete = async () => {
    if (!indicator) return
    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar este indicador?',
    )
    if (!confirmed) return
    await deleteIndicator(indicator.uid)
    navigate(
      `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goalUid}/indicators?deleted=success`,
    )
  }

  const handleCancel = () => {
    navigate(
      `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goalUid}/indicators`,
    )
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

          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <IndicatorTypeSelect
                      onValueChange={field.onChange}
                      {...omit(field, 'onChange')}
                      placeholder='Selecciona un tipo'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='unitType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <FormControl>
                    <Input className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='minValue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor mínimo</FormLabel>
                  <FormControl>
                    <Input type='number' className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='maxValue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor máximo</FormLabel>
                  <FormControl>
                    <Input type='number' className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
