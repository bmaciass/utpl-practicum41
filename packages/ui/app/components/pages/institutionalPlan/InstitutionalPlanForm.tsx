import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@remix-run/react'
import { isNil } from 'lodash-es'
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
import type { GetInstitutionalPlan_UseGetInstitutionalPlanQuery } from '~/gql/graphql'
import { useCreateInstitutionalPlan } from '~/hooks/institutionalPlan/useCreateInstitutionalPlan'
import { useUpdateInstitutionalPlan } from '~/hooks/institutionalPlan/useUpdateInstitutionalPlan'

const formSchema = z.object({
  name: z.string().min(2, {
    error: 'Nombre debe tener al menos dos caracteres',
  }),
  description: z.string().min(2, {
    error: 'Nombre debe tener al menos dos caracteres',
  }),
  year: z.coerce
    .number<number>()
    .positive()
    .min(2000, {
      error: 'Año debe ser mayor o igual a 2000',
    })
    .max(new Date().getFullYear(), {
      error: `Año debe ser menor o igual a ${new Date().getFullYear()}`,
    }),
  url: z.url({
    error: 'URL debe ser válida',
  }).optional(),
})

export function InstitutionalPlanForm (props: {
  institutionalPlan?: GetInstitutionalPlan_UseGetInstitutionalPlanQuery['institutionalPlan']['one']
  institutionUid: string
}) {
  const { institutionalPlan, institutionUid } = props
  const shouldUpdate = !isNil(institutionalPlan)

  const {
    createInstitutionalPlan,
    error: errorCreate,
    loading: loadingCreate,
    institutionalPlan: institutionalPlanCreated,
  } = useCreateInstitutionalPlan()
  const {
    updateInstitutionalPlan,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useUpdateInstitutionalPlan()

  const error = errorCreate ?? errorUpdate
  const loading = loadingCreate ?? loadingUpdate

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      year: new Date().getFullYear(),
      url: '',
    },
  })

  useEffect(() => {
    if (institutionalPlan) {
      form.reset({
        name: institutionalPlan.name,
        year: institutionalPlan.year,
        url: institutionalPlan.url ?? undefined,
        description: institutionalPlan.description,
      })
    }
  }, [form, institutionalPlan])

  useEffect(() => {
    if (institutionalPlanCreated) {
      navigate(
        `/institutions/${institutionUid}/plans/${institutionalPlanCreated.uid}`,
      )
    }
  }, [institutionalPlanCreated, navigate, institutionUid])

  const onCancel = () => {
    navigate(`/institutions/${institutionUid}/plans`)
  }

  function onSubmit (values: z.infer<typeof formSchema>) {
    if (shouldUpdate) {
      updateInstitutionalPlan({
        variables: {
          data: {
            name: values.name,
            year: values.year,
            url: values.url,
          },
          where: { uid: institutionalPlan.uid },
        },
      })
      return
    }
    createInstitutionalPlan({
      variables: {
        data: {
          name: values.name,
          year: values.year,
          url: values.url,
          institutionId: institutionUid,
          description: values.description,
        },
      },
    })
  }

  return (
    <div className='flex flex-col space-y-2'>
      {error && (
        <Alert
          closable
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del plan</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2'>
            <div className='grow'>
              <FormField
                control={form.control}
                name='year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grow'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-x-2'>
            <Button variant={'secondary'} type='button' onClick={onCancel}>
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
