import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@remix-run/react'
import { isNil, omit } from 'lodash-es'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert } from '~/components/globals/Alert'
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
import type { GetPrograms_UseGetProgramQuery } from '~/gql/graphql'
import { useCreateProgram } from '~/hooks/program/useCreateProgram'
import { useUpdateProgram } from '~/hooks/program/useUpdateProgram'

const formSchema = z.object({
  name: z.string().min(2, {
    error: 'Nombre debe tener al menos dos caracteres',
  }),
  description: z.string().min(10, {
    error: 'Descripcion debe tener al menos 10 caracteres',
  }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedInversion: z.string().optional(),
  responsibleUid: z.string().nonoptional(),
})

const parseDecimal = (value?: string) => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function ProgramForm(props: {
  program?: GetPrograms_UseGetProgramQuery['program']['one']
}) {
  const { program } = props
  const shouldUpdate = !isNil(program)

  const {
    createProgram,
    error: errorCreate,
    loading: loadingCreate,
    program: programCreated,
  } = useCreateProgram()
  const {
    updateProgram,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useUpdateProgram()

  const error = errorCreate ?? errorUpdate
  const loading = loadingCreate ?? loadingUpdate

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      estimatedInversion: '',
      responsibleUid: '',
    },
  })

  useEffect(() => {
    if (program) {
      form.reset({
        name: program.name,
        description: program.description ?? '',
        startDate: program.startDate
          ? new Date(program.startDate).toISOString().split('T')[0]
          : '',
        endDate: program.endDate
          ? new Date(program.endDate).toISOString().split('T')[0]
          : '',
        estimatedInversion:
          program.estimatedInversion !== null &&
          program.estimatedInversion !== undefined
            ? String(program.estimatedInversion)
            : '',
        responsibleUid: program.responsible.uid,
      })
    }
  }, [form, program])

  useEffect(() => {
    if (programCreated) {
      navigate(`/programs/${programCreated.uid}`)
    }
  }, [programCreated, navigate])

  const onCancel = () => {
    navigate('/programs')
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      name: values.name,
      description: values.description,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      estimatedInversion: parseDecimal(values.estimatedInversion),
    }

    if (shouldUpdate) {
      updateProgram({
        variables: {
          data: {
            ...payload,
            responsibleId: values.responsibleUid,
          },
          where: { id: program.uid },
        },
      })
      return
    }
    createProgram({
      variables: {
        data: {
          ...payload,
          responsibleUid: values.responsibleUid,
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
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2'>
            <div className='grow'>
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
            </div>
            <div className='grow'>
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
            </div>
            <div className='grow'>
              <FormField
                control={form.control}
                name='estimatedInversion'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inversion estimada</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
