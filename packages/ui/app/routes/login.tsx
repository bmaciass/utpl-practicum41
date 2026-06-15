import { type ActionFunctionArgs, data } from '@remix-run/cloudflare'
import { useActionData, useNavigate, useSubmit } from '@remix-run/react'
import {
  DrizzleAuthSessionRepository,
  DrizzleRoleRepository,
  DrizzleUserRepository,
  getDefaultJWTService,
  LoginUseCase,
  withAuditedAction,
} from '@sigep/api'
import {
  closeDBClient,
  connectDBClient,
  getDBConnection,
  type Client,
} from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { isEmpty } from 'lodash-es'
import { useEffect, useRef } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getAccessTokenExpiryCookie } from '~/cookies/access-token-expiry.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'
import { notFound } from '~/helpers/notFound'
import { getRequestId, logServerError } from '~/helpers/serverError'

type LoginActionData = {
  error: string | null
  errorCode?: 'INVALID_CREDENTIALS' | 'SERVER_ERROR'
  requestId?: string
}

export const action = async ({ context, request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') return notFound('Method not found')

  const requestId = getRequestId(request)
  const startedAt = Date.now()
  const environment = context.cloudflare.env.ENVIRONMENT
  console.log('[ui] Login action started', {
    requestId,
    method: request.method,
    url: request.url,
    hasDatabaseUrl: Boolean(context.cloudflare.env.DATABASE_URL),
  })

  const databaseUrl = context.cloudflare.env.DATABASE_URL?.connectionString
  const cookieSecret = context.cloudflare.env.UI_AUTH_COOKIE_SECRET
  if (!databaseUrl || !cookieSecret) {
    console.error('[ui] Login action missing required environment', {
      requestId,
      hasDatabaseUrl: Boolean(databaseUrl),
      hasCookieSecret: Boolean(cookieSecret),
      durationMs: Date.now() - startedAt,
    })
    return data<LoginActionData>(
      {
        error:
          'No se pudo iniciar sesion por un error de configuracion del servidor.',
        errorCode: 'SERVER_ERROR',
        requestId,
      },
      { status: 500 },
    )
  }

  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')
  const usernameString = username?.toString() ?? null

  if (!username || !password) {
    console.log('[ui] Login action rejected missing credentials', {
      requestId,
      hasUsername: Boolean(username),
      hasPassword: Boolean(password),
      durationMs: Date.now() - startedAt,
    })
    return data<LoginActionData>(
      { error: 'Username or password not found' },
      { status: 400 },
    )
  }
  if (isEmpty(username) || isEmpty(password)) {
    console.log('[ui] Login action rejected empty credentials', {
      requestId,
      username: usernameString,
      durationMs: Date.now() - startedAt,
    })
    return data<LoginActionData>(
      { error: 'Username or password not found' },
      { status: 400 },
    )
  }

  let client: Client | null = null

  try {
    console.log('[ui] Login action creating DB client', {
      requestId,
      username: usernameString,
    })
    const connection = await getDBConnection(databaseUrl)
    client = connection.client
    const { db } = connection

    await connectDBClient(client, databaseUrl)
    console.log('[ui] Login action DB connected', {
      requestId,
      username: usernameString,
      durationMs: Date.now() - startedAt,
    })

    const userRepository = new DrizzleUserRepository(db)
    const roleRepository = new DrizzleRoleRepository(db)
    const authSessionRepository = new DrizzleAuthSessionRepository(db)
    const jwtService = await getDefaultJWTService()
    console.log('[ui] Login action dependencies ready', {
      requestId,
      username: usernameString,
      durationMs: Date.now() - startedAt,
    })

    const login = withAuditedAction(
      {
        action: 'login',
        resourceType: 'auth_session',
        routeName: 'login',
        getActorUserUid: async (input) =>
          (await userRepository.findByName(input.username))?.uid ?? null,
        getActorLabel: (input) => input.username,
        getResourceUid: async (_input, result) =>
          (await jwtService.verifyRefreshToken(result.refreshToken))
            ?.sessionId ?? null,
      },
      (input) =>
        new LoginUseCase({
          authSessionRepository,
          roleRepository,
          userRepository,
        }).execute(input),
    )

    console.log('[ui] Login action executing use case', {
      requestId,
      username: usernameString,
      durationMs: Date.now() - startedAt,
    })
    const { accessToken, refreshToken, accessTokenExpiresAt } = await login(
      {
        username: username.toString(),
        password: password.toString(),
      },
      { db, request },
    )
    console.log('[ui] Login action use case succeeded', {
      requestId,
      username: usernameString,
      accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      durationMs: Date.now() - startedAt,
    })

    const accessCookie = getAccessTokenCookie({
      secret: cookieSecret,
      environment,
      request,
    })
    const serializedAccessCookie = await accessCookie.serialize(accessToken)
    const accessExpiryCookie = getAccessTokenExpiryCookie({
      environment,
      request,
    })
    const serializedAccessExpiryCookie = await accessExpiryCookie.serialize(
      `${accessTokenExpiresAt.getTime()}`,
    )

    const refreshCookie = getRefreshTokenCookie({
      secret: cookieSecret,
      environment,
      request,
    })
    const serializedRefreshCookie = await refreshCookie.serialize(refreshToken)

    const headers = new Headers()
    headers.append('Set-Cookie', serializedAccessCookie)
    headers.append('Set-Cookie', serializedAccessExpiryCookie)
    headers.append('Set-Cookie', serializedRefreshCookie)

    console.log('[ui] Login action returning success response', {
      requestId,
      username: usernameString,
      setCookieCount: 3,
      durationMs: Date.now() - startedAt,
    })
    return data<LoginActionData>({ error: null }, { headers })
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      (error instanceof Error &&
        error.message === 'username or password incorrect')
    ) {
      console.log('[ui] Login action invalid credentials', {
        requestId,
        username: usernameString,
        durationMs: Date.now() - startedAt,
      })
      return data<LoginActionData>(
        {
          error: 'Credenciales incorrectas',
          errorCode: 'INVALID_CREDENTIALS',
        },
        { status: 401 },
      )
    }

    logServerError('[ui] Login action failed', request, error, {
      requestId,
      routeName: 'login',
      username: username.toString(),
    })

    console.error('[ui] Login action returning server error response', {
      requestId,
      username: usernameString,
      durationMs: Date.now() - startedAt,
    })
    return data<LoginActionData>(
      {
        error:
          'No se pudo iniciar sesion por un error del servidor. Revisa los logs del Worker con el request ID.',
        errorCode: 'SERVER_ERROR',
        requestId,
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      try {
        console.log('[ui] Login action closing DB client', {
          requestId,
          username: usernameString,
          durationMs: Date.now() - startedAt,
        })
        await closeDBClient(client, databaseUrl)
        console.log('[ui] Login action DB client closed', {
          requestId,
          username: usernameString,
          durationMs: Date.now() - startedAt,
        })
      } catch (error) {
        console.error('[ui] Login action failed to close DB client', {
          requestId,
          username: usernameString,
          durationMs: Date.now() - startedAt,
          error,
        })
      }
    }
  }
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
        <CardHeader className='items-center gap-4'>
          <img
            src='/assets/sigep-vertical.png'
            alt='SIGEP'
            className='h-32 w-auto object-contain'
          />
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
          <AlertDescription>
            {error}
            {actionData?.requestId ? (
              <>
                {' '}
                Request ID: <code>{actionData.requestId}</code>
              </>
            ) : null}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default function Index() {
  return <Login />
}
