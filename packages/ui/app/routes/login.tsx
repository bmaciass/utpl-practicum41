import { type ActionFunctionArgs, data } from '@remix-run/cloudflare'
import { useActionData, useNavigate, useSubmit } from '@remix-run/react'
import {
  DrizzleRoleRepository,
  DrizzleUserRepository,
  LoginUseCase,
} from '@sigep/api'
import { getDBConnection } from '@sigep/db'
import { isEmpty } from 'lodash-es'
import { useEffect, useRef } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'
import { notFound } from '~/helpers/notFound'

export const action = async ({ context, request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') return notFound('Method not found')

  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')
  if (!username || !password) return { error: 'username or password not found' }
  if (isEmpty(username) || isEmpty(password))
    return { error: 'username or password not found' }

  const { client, db } = await getDBConnection(
    context.cloudflare.env.DATABASE_URL,
  )
  await client.connect()

  const userRepository = new DrizzleUserRepository(db)
  const roleRepository = new DrizzleRoleRepository(db)

  const { accessToken, refreshToken } = await new LoginUseCase({
    roleRepository,
    userRepository,
  }).execute({
    username: username.toString(),
    password: password.toString(),
  })

  const accessCookie = getAccessTokenCookie(
    context.cloudflare.env.UI_AUTH_COOKIE_SECRET,
  )
  const serializedAccessCookie = await accessCookie.serialize(accessToken)

  const refreshCookie = getRefreshTokenCookie(
    context.cloudflare.env.UI_AUTH_COOKIE_SECRET,
  )
  const serializedRefreshCookie = await refreshCookie.serialize(refreshToken)

  const headers = new Headers()
  headers.append('Set-Cookie', serializedAccessCookie)
  headers.append('Set-Cookie', serializedRefreshCookie)

  return data({ error: null }, { headers })
}

function Login() {
  const navigate = useNavigate()
  const submit = useSubmit()
  const actionData = useActionData<typeof action>()
  const error = actionData?.error
  const usernameRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (actionData && !actionData.error) {
      navigate('/')
    }
  }, [actionData, navigate])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (!username || !password) return

    const formData = new FormData()
    formData.set('username', username)
    formData.set('password', password)
    submit(formData, { action: '/login', method: 'post' })
  }

  return (
    <div className='min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100'>
      <Card className='w-full max-w-sm p-4'>
        <CardHeader>
          <CardTitle className='text-center'>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                name='username'
                type='text'
                required
                ref={usernameRef}
                defaultValue={'admin'}
              />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                required
                ref={passwordRef}
                defaultValue={'admin'}
              />
            </div>
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      {error && (
        <Alert className='max-w-sm' variant={'destructive'}>
          <AlertDescription>Credenciales incorrectas</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default function Index() {
  return <Login />
}
