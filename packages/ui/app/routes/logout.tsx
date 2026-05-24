import { type LoaderFunction, redirect } from '@remix-run/cloudflare'
import { DrizzleAuthSessionRepository, getDefaultJWTService } from '@sigep/api'
import { getDBConnection } from '@sigep/db'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getAccessTokenExpiryCookie } from '~/cookies/access-token-expiry.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'

export default function Index() {
  return 'Redirecting...'
}

export const loader: LoaderFunction = async ({ context, request }) => {
  const secret = context.cloudflare.env.UI_AUTH_COOKIE_SECRET
  const accessTokenExpiryCookie = getAccessTokenExpiryCookie()

  const accessTokenCookie = getAccessTokenCookie(secret)
  const refreshTokenCookie = getRefreshTokenCookie(secret)

  const { client, db } = await getDBConnection(context.cloudflare.env.DATABASE_URL)
  await client.connect()

  try {
    const cookieHeader = request.headers.get('Cookie')
    if (cookieHeader) {
      const refreshToken = await refreshTokenCookie.parse(cookieHeader)
      if (refreshToken) {
        const jwtService = await getDefaultJWTService()
        const payload = await jwtService.verifyRefreshToken(refreshToken)

        if (payload?.sessionId) {
          await new DrizzleAuthSessionRepository(db).revoke(payload.sessionId)
        }
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
