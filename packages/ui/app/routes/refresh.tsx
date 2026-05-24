import { type LoaderFunctionArgs, redirect } from '@remix-run/cloudflare'
import {
  DrizzleAuthSessionRepository,
  DrizzleRoleRepository,
  DrizzleUserRepository,
  getDefaultJWTService,
  RefreshTokenUseCase,
  withAuditedAction,
} from '@sigep/api'
import { getDBConnection } from '@sigep/db'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getAccessTokenExpiryCookie } from '~/cookies/access-token-expiry.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'

function wantsJsonResponse(request: Request) {
  const url = new URL(request.url)
  return (
    url.searchParams.get('mode') === 'json' ||
    request.headers.get('x-refresh-request') === '1' ||
    request.headers.get('accept')?.includes('application/json') === true
  )
}

async function clearAuthCookies(secret: string) {
  const accessCookie = getAccessTokenCookie(secret)
  const accessExpiryCookie = getAccessTokenExpiryCookie()
  const refreshCookie = getRefreshTokenCookie(secret)

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
  const refreshCookie = getRefreshTokenCookie(secret)
  const shouldReturnJson = wantsJsonResponse(request)

  // Read refresh token from HTTP-only cookie
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) {
    const headers = await clearAuthCookies(secret)
    if (shouldReturnJson) {
      return new Response(null, { status: 401, headers })
    }
    return redirect('/login', { headers })
  }

  const refreshToken = await refreshCookie.parse(cookieHeader)
  if (!refreshToken) {
    const headers = await clearAuthCookies(secret)
    if (shouldReturnJson) {
      return new Response(null, { status: 401, headers })
    }
    return redirect('/login', { headers })
  }

  // Connect to database
  const { client, db } = await getDBConnection(
    context.cloudflare.env.DATABASE_URL,
  )
  await client.connect()
  const authSessionRepository = new DrizzleAuthSessionRepository(db)
  const userRepository = new DrizzleUserRepository(db)
  const roleRepository = new DrizzleRoleRepository(db)
  const jwtService = await getDefaultJWTService()

  try {
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
    const accessCookie = getAccessTokenCookie(secret)
    const accessExpiryCookie = getAccessTokenExpiryCookie()
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
    const headers = await clearAuthCookies(secret)
    if (shouldReturnJson) {
      return new Response(null, { status: 401, headers })
    }
    return redirect('/login', { headers })
  } finally {
    await client.end()
  }
}

export default function Refresh() {
  return null
}
