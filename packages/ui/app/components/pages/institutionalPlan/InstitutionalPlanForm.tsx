import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@remix-run/react'
import { isNil } from 'lodash-es'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import type { GetInstitutionalPlans_UseGetInstitutionalPlanQuery } from '~/gql/graphql'
import { useCreateInstitutionalPlan } from '~/hooks/institutionalPlan/useCreateInstitutionalPlan'
import { useUpdateInstitutionalPlan } from '~/hooks/institutionalPlan/useUpdateInstitutionalPlan'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nombre debe tener al menos dos caracteres',
  }),
  year: z.coerce.number().min(1900, {
    message: 'Año debe ser válido',
  }),
  version: z.coerce.number().min(1, {
    message: 'Versión debe ser al menos 1',
  }),
  url: z.string().url({
    message: 'URL debe ser válida',
  }),
  active: z.boolean(),
})

export function InstitutionalPlanForm(props: {
  institutionalPlan?: GetInstitutionalPlans_UseGetInstitutionalPlanQuery['institutionalPlan']['one']
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
      year: new Date().getFullYear(),
      version: 1,
      url: '',
      active: true,
    },
  })

  useEffect(() => {
    if (institutionalPlan) {
      form.reset({
        name: institutionalPlan.name,
        year: institutionalPlan.year,
        version: institutionalPlan.version,
        url: institutionalPlan.institution.uid,
        active: institutionalPlan.active,
      })
    }
  }, [form, institutionalPlan])

  useEffect(() => {
    if (institutionalPlanCreated) {
      navigate(`/institutions/${institutionUid}/plans/${institutionalPlanCreated.uid}`)
    }
  }, [institutionalPlanCreated, navigate, institutionUid])

  const onCancel = () => {
    navigate(`/institutions/${institutionUid}/plans`)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (shouldUpdate) {
      updateInstitutionalPlan({
        variables: {
          data: {
            name: values.name,
            year: values.year,
            active: values.active,
          },
          where: { id: institutionalPlan.uid },
        },
      })
      return
    }
    createInstitutionalPlan({
      variables: {
        data: {
          name: values.name,
          year: values.year,
          version: values.version,
          url: values.url,
          institutionId: institutionUid,
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
                  <Input className='w-1/2' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='year'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Año</FormLabel>
                <FormControl>
                  <Input type='number' className='w-1/2' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='version'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Versión</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    className='w-1/2'
                    {...field}
                    disabled={shouldUpdate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    type='url'
                    className='w-1/2'
                    {...field}
                    disabled={shouldUpdate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='active'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center gap-2'>
                <FormLabel>Activo</FormLabel>
                <FormControl>
                  <Checkbox
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    ref={field.ref}
                  />
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