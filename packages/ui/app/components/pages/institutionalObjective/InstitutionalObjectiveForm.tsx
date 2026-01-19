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
import type { GetInstitutionalObjective_UseGetInstitutionalObjectiveQuery } from '~/gql/graphql'
import { useCreateInstitutionalObjective } from '~/hooks/institutionalObjective/useCreateInstitutionalObjective'
import { useUpdateInstitutionalObjective } from '~/hooks/institutionalObjective/useUpdateInstitutionalObjective'

const formSchema = z.object({
  name: z.string().min(2, {
    error: 'Nombre debe tener al menos 2 caracteres',
  }),
  description: z
    .string()
    .min(10, { error: 'Descripcion debe tener al menos 10 caracteres' }),
  institutionId: z.string(),
})

export function InstitutionalObjectiveForm(props: {
  institutionalObjective?: GetInstitutionalObjective_UseGetInstitutionalObjectiveQuery['institutionalObjective']['one']
  institutionUid: string
}) {
  const { institutionalObjective, institutionUid } = props
  const shouldUpdate = !isNil(institutionalObjective)

  const {
    create,
    error: errorCreate,
    loading: loadingCreate,
    data: dataCreate,
  } = useCreateInstitutionalObjective()
  const {
    update,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useUpdateInstitutionalObjective(institutionUid)

  const error = errorCreate ?? errorUpdate
  const loading = loadingCreate ?? loadingUpdate

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      institutionId: institutionUid,
    },
  })

  useEffect(() => {
    if (shouldUpdate && institutionalObjective) {
      form.reset({
        name: institutionalObjective.name,
        description: institutionalObjective.description ?? '',
        institutionId: institutionUid,
      })
    }
  }, [form, institutionalObjective, shouldUpdate, institutionUid])

  useEffect(() => {
    if (dataCreate?.institutionalObjective.create) {
      navigate(
        `/institutions/${institutionUid}/objectives/${dataCreate.institutionalObjective.create.uid}`,
      )
    }
  }, [dataCreate, navigate, institutionUid])

  const onCancel = () => {
    navigate(`/institutions/${institutionUid}/objectives`)
  }

  const handleDelete = async () => {
    if (!institutionalObjective) return

    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar este objetivo institucional?',
    )

    if (!confirmed) return

    await update({
      variables: {
        where: { uid: institutionalObjective.uid },
        data: { active: false },
      },
    })

    navigate(`/institutions/${institutionUid}/objectives?deleted=success`)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (shouldUpdate && institutionalObjective) {
      update({
        variables: {
          data: {
            name: values.name,
            description: values.description,
          },
          where: { uid: institutionalObjective.uid },
        },
      })
      return
    }
    create({
      variables: {
        data: {
          name: values.name,
          description: values.description,
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
                <FormLabel>Nombre</FormLabel>
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
          <div className='flex gap-x-2'>
            <Button variant={'secondary'} type='button' onClick={onCancel}>
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              {shouldUpdate ? 'Actualizar' : 'Crear'}
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
