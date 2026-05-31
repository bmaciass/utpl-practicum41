import { type LoaderFunction, redirect } from '@remix-run/cloudflare'
import {
  DrizzleAuthSessionRepository,
  LogoutUseCase,
  getDefaultJWTService,
  withAuditedAction,
} from '@sigep/api'
import { connectDBClient, getDBConnection } from '@sigep/db'
import { getAccessTokenExpiryCookie } from '~/cookies/access-token-expiry.server'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'

export default function Index () {
  return 'Redirecting...'
}

export const loader: LoaderFunction = async ({ context, request }) => {
  const secret = context.cloudflare.env.UI_AUTH_COOKIE_SECRET
  const accessTokenExpiryCookie = getAccessTokenExpiryCookie()

  const accessTokenCookie = getAccessTokenCookie(secret)
  const refreshTokenCookie = getRefreshTokenCookie(secret)

  const { client, db } = await getDBConnection(
    context.cloudflare.env.DATABASE_URL,
  )
  await connectDBClient(client, context.cloudflare.env.DATABASE_URL)
  const authSessionRepository = new DrizzleAuthSessionRepository(db)
  const jwtService = await getDefaultJWTService()

  try {
    const cookieHeader = request.headers.get('Cookie')
    if (cookieHeader) {
      const refreshToken = await refreshTokenCookie.parse(cookieHeader)
      if (refreshToken) {
        const logout = withAuditedAction(
          {
            action: 'logout',
            resourceType: 'auth_session',
            routeName: 'logout',
            getInitialResourceUid: async (input) =>
              (await jwtService.verifyRefreshToken(input.refreshToken))
                ?.sessionId ?? null,
            getActorUserUid: async (input) =>
              (await jwtService.verifyRefreshToken(input.refreshToken))?.sub ??
              null,
            getResourceUid: async (input) =>
              (await jwtService.verifyRefreshToken(input.refreshToken))
                ?.sessionId ?? null,
          },
          (input) =>
            new LogoutUseCase({
              authSessionRepository,
              jwtService,
            }).execute(input),
        )

        await logout(
          {
            refreshToken,
          },
          { db, request },
        )
      }
    }
  } finally {
    await client.end()
  }

  const clearAccessCookie = await accessTokenCookie.serialize('', {
    maxAge: 0,
    path: '/',
  })
  const clearAccessExpiryCookie = await accessTokenExpiryCookie.serialize('', {
    maxAge: 0,
    path: '/',
  })

  const clearRefreshCookie = await refreshTokenCookie.serialize('', {
    maxAge: 0,
    path: '/',
  })

  const headers = new Headers()
  headers.append('Set-Cookie', clearAccessCookie)
  headers.append('Set-Cookie', clearAccessExpiryCookie)
  headers.append('Set-Cookie', clearRefreshCookie)

  return redirect('/', { headers })
}
