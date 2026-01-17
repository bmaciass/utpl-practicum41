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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type {
  GetInstitutions_UseGetInstitutionQuery,
  InstitutionArea,
  InstitutionLevel,
} from '~/gql/graphql'
import { useCreateInstitution } from '~/hooks/institution/useCreateInstitution'
import { useUpdateInstitution } from '~/hooks/institution/useUpdateInstitution'

const formSchema = z.object({
  name: z.string().min(2, {
    error: 'Nombre debe tener al menos dos caracteres',
  }),
  area: z.enum(['educacion'], { error: 'Debe seleccionar un sector' }),
  level: z.enum(['nacional'], {
    error: 'Debe seleccionar un nivel de gobernanza',
  }),
})

export function InstitutionForm (props: {
  institution?: GetInstitutions_UseGetInstitutionQuery['institution']['one']
}) {
  const { institution } = props
  const shouldUpdate = !isNil(institution)

  const {
    createInstitution,
    error: errorCreate,
    loading: loadingCreate,
    institution: institutionCreated,
  } = useCreateInstitution()
  const {
    updateInstitution,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useUpdateInstitution()

  const error = errorCreate ?? errorUpdate
  const loading = loadingCreate ?? loadingUpdate

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      area: 'educacion',
      level: 'nacional',
    },
  })

  useEffect(() => {
    if (institution) {
      form.reset(institution)
    }
  }, [form, institution])

  useEffect(() => {
    if (institutionCreated) {
      navigate(`/institutions/${institutionCreated.uid}`)
    }
  }, [institutionCreated, navigate])

  const onCancel = () => {
    navigate('/institutions')
  }

  function onSubmit (values: z.infer<typeof formSchema>) {
    if (shouldUpdate) {
      updateInstitution({
        variables: {
          data: {
            area: values.area as InstitutionArea,
            level: values.level as InstitutionLevel,
            name: values.name,
          },
          where: { id: institution.uid },
        },
      })
      return
    }
    createInstitution({
      variables: {
        data: {
          area: values.area as InstitutionArea,
          level: values.level as InstitutionLevel,
          name: values.name,
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
                <FormLabel>Nombre de institucion</FormLabel>
                <FormControl>
                  <Input className='w-1/2' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex w-1/2'>
            <div className='grow'>
              <FormField
                control={form.control}
                name='area'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Selecciona un sector' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='educacion'>Educacion</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grow'>
              <FormField
                control={form.control}
                name='level'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de gobernanza</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Selecciona un nivel' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='nacional'>Nacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
