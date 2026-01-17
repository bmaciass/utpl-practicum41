import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@remix-run/react'
import { pick } from 'lodash-es'
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
import type { GetUsers_UseGetUserQuery } from '~/gql/graphql'
import { useCreateUser } from '~/hooks/user/useCreateUser'
import { useDeleteUser } from '~/hooks/user/useDeleteUser'
import { useUpdateUser } from '~/hooks/user/useUpdateUser'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nombre debe tener al menos dos caracteres',
  }),
  password: z.union([
    z.string().min(5, {
      message: 'La clave debe tener al menos cinco caracteres',
    }),
    z.literal(''),
  ]),
  firstName: z.string().min(2, {
    message: 'Nombre debe tener al menos dos caracteres',
  }),
  lastName: z.string().min(2, {
    message: 'Nombre debe tener al menos dos caracteres',
  }),
  dni: z.string().min(9, {
    message: 'Nombre debe tener al menos nueve caracteres',
  }),
})

export function UserForm(props: {
  user?: GetUsers_UseGetUserQuery['user']['one']
}) {
  const { user } = props
  const shouldUpdate = typeof user !== 'undefined' && user !== null

  const {
    createUser,
    error: errorCreate,
    loading: loadingCreate,
    user: userCreated,
  } = useCreateUser()
  const {
    updateUser,
    error: errorUpdate,
    loading: loadingUpdate,
  } = useUpdateUser()
  const {
    deleteUser,
    error: errorDelete,
    loading: loadingDelete,
  } = useDeleteUser()

  const error = errorCreate ?? errorUpdate ?? errorDelete
  const loading = loadingCreate || loadingUpdate || loadingDelete

  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      dni: '',
      firstName: '',
      lastName: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? '',
        password: '',
        dni: user.person?.dni ?? '',
        firstName: user.person?.firstName ?? '',
        lastName: user.person?.lastName ?? '',
      })
    }
  }, [form, user])

  useEffect(() => {
    if (userCreated) {
      navigate(`/users/${userCreated.uid}`)
    }
  }, [userCreated, navigate])

  const onCancel = () => {
    navigate('/users')
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (shouldUpdate && user) {
      const updateData = {
        name: values.name,
        dni: values.dni,
        firstName: values.firstName,
        lastName: values.lastName,
        ...(values.password ? { password: values.password } : {}),
      }
      updateUser({ variables: { data: updateData, where: { id: user.uid } } })
      return
    }
    if (!values.password) {
      form.setError('password', {
        type: 'manual',
        message: 'La clave es requerida para crear el usuario',
      })
      return
    }
    createUser({
      variables: {
        data: pick(values, [
          'dni',
          'firstName',
          'lastName',
          'name',
          'password',
        ]),
      },
    })
  }

  const handleDelete = async () => {
    if (!user) return
    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar este usuario?',
    )
    if (!confirmed) return
    await deleteUser(user.uid)
    navigate('/users')
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
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <Input className='w-1/2' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clave</FormLabel>
                <FormControl>
                  <Input className='w-1/2' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dni'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cedula</FormLabel>
                <FormControl>
                  <Input className='w-1/2' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input className='w-1/2' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input className='w-1/2' {...field} />
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
