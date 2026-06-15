import { type LoaderFunctionArgs, redirect } from '@remix-run/cloudflare'
import {
  DrizzleAuthSessionRepository,
  DrizzleRoleRepository,
  DrizzleUserRepository,
  RefreshTokenUseCase,
  getDefaultJWTService,
  withAuditedAction,
} from '@sigep/api'
import { closeDBClient, connectDBClient, getDBConnection } from '@sigep/db'
import { getAccessTokenExpiryCookie } from '~/cookies/access-token-expiry.server'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'

function wantsJsonResponse (request: Request) {
  const url = new URL(request.url)
  return (
    url.searchParams.get('mode') === 'json' ||
    request.headers.get('x-refresh-request') === '1' ||
    request.headers.get('accept')?.includes('application/json') === true
  )
}

async function clearAuthCookies (
  secret: string,
  environment: string | undefined,
  request: Request,
) {
  const accessCookie = getAccessTokenCookie({
    secret,
    environment,
    request,
  })
  const accessExpiryCookie = getAccessTokenExpiryCookie({
    environment,
    request,
  })
  const refreshCookie = getRefreshTokenCookie({
    secret,
    environment,
    request,
  })

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await accessCookie.serialize('', { maxAge: 0, path: '/' }),
  )
  headers.append(
    'Set-Cookie',
    await accessExpiryCookie.serialize('', { maxAge: 0, path: '/' }),
  )
  headers.append(
    'Set-Cookie',
    await refreshCookie.serialize('', { maxAge: 0, path: '/' }),
  )

  return headers
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const secret = context.cloudflare.env.UI_AUTH_COOKIE_SECRET
  if (!secret) {
    if (wantsJsonResponse(request)) {
      return new Response(null, { status: 500 })
    }
    return redirect('/login')
  }
  const environment = context.cloudflare.env.ENVIRONMENT
  const databaseUrl = context.cloudflare.env.DATABASE_URL.connectionString
  const refreshCookie = getRefreshTokenCookie({
    secret,
    environment,
    request,
  })
  const shouldReturnJson = wantsJsonResponse(request)

  // Read refresh token from HTTP-only cookie
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) {
    const headers = await clearAuthCookies(secret, environment, request)
    if (shouldReturnJson) {
      return new Response(null, { status: 401, headers })
    }
    return redirect('/login', { headers })
  }

  const refreshToken = await refreshCookie.parse(cookieHeader)
  if (!refreshToken) {
    const headers = await clearAuthCookies(secret, environment, request)
    if (shouldReturnJson) {
      return new Response(null, { status: 401, headers })
    }
    return redirect('/login', { headers })
  }

  const { client, db } = await getDBConnection(databaseUrl)

  try {
    await connectDBClient(client, databaseUrl)
    const authSessionRepository = new DrizzleAuthSessionRepository(db)
    const userRepository = new DrizzleUserRepository(db)
    const roleRepository = new DrizzleRoleRepository(db)
    const jwtService = await getDefaultJWTService()
    const refreshSession = withAuditedAction(
      {
        action: 'refresh',
        resourceType: 'auth_session',
        routeName: 'refresh',
        getInitialResourceUid: async (input) =>
          (await jwtService.verifyRefreshToken(input.refreshToken))
            ?.sessionId ?? null,
        getActorUserUid: async (input) =>
          (await jwtService.verifyRefreshToken(input.refreshToken))?.sub ??
          null,
        getResourceUid: async (_input, result) =>
          (await jwtService.verifyRefreshToken(result.refreshToken))
            ?.sessionId ?? null,
        getMetadata: async () => ({
          responseMode: shouldReturnJson ? 'json' : 'redirect',
          redirectTo: new URL(request.url).searchParams.get('redirectTo'),
        }),
      },
      (input) =>
        new RefreshTokenUseCase({
          authSessionRepository,
          userRepository,
          roleRepository,
        }).execute(input),
    )

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt,
    } = await refreshSession(
      {
        refreshToken,
      },
      { db, request },
    )

    // Set BOTH new cookies (old tokens invalidated)
    const accessCookie = getAccessTokenCookie({
      secret,
      environment,
      request,
    })
    const accessExpiryCookie = getAccessTokenExpiryCookie({
      environment,
      request,
    })
    const serializedAccess = await accessCookie.serialize(newAccessToken)
    const serializedAccessExpiry = await accessExpiryCookie.serialize(
      `${accessTokenExpiresAt.getTime()}`,
    )
    const serializedRefresh = await refreshCookie.serialize(newRefreshToken)

    const headers = new Headers()
    headers.append('Set-Cookie', serializedAccess)
    headers.append('Set-Cookie', serializedAccessExpiry)
    headers.append('Set-Cookie', serializedRefresh)

    if (shouldReturnJson) {
      return new Response(null, { status: 204, headers })
    }

    const url = new URL(request.url)
    const redirectTo = url.searchParams.get('redirectTo') || '/'
    return redirect(redirectTo, { headers })
  } catch (error) {
    console.error('[refresh] token refresh failed:', error)
    const headers = await clearAuthCookies(secret, environment, request)
    if (shouldReturnJson) {
      return new Response(null, { status: 401, headers })
    }
    return redirect('/login', { headers })
  } finally {
    await closeDBClient(client, databaseUrl)
  }
}

export default function Refresh () {
  return null
}
