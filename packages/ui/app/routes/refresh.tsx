import { type ActionFunction, redirect } from '@remix-run/cloudflare'
import {
  DrizzleRoleRepository,
  DrizzleUserRepository,
  RefreshTokenUseCase,
} from '@sigep/api'
import { getDBConnection } from '@sigep/db'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'

export const action: ActionFunction = async ({ context, request }) => {
  const secret = context.cloudflare.env.UI_AUTH_COOKIE_SECRET
  const refreshCookie = getRefreshTokenCookie(secret)

  // Read refresh token from HTTP-only cookie
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) {
    return redirect('/login')
  }

  const refreshToken = await refreshCookie.parse(cookieHeader)
  if (!refreshToken) {
    return redirect('/login')
  }

  // Connect to database
  const { client, db } = await getDBConnection(
    context.cloudflare.env.DATABASE_URL,
  )
  await client.connect()

  try {
    const refreshTokenUseCase = new RefreshTokenUseCase({
      userRepository: new DrizzleUserRepository(db),
      roleRepository: new DrizzleRoleRepository(db),
    })

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await refreshTokenUseCase.execute({
        refreshToken,
      })

    // Set BOTH new cookies (old tokens invalidated)
    const accessCookie = getAccessTokenCookie(secret)
    const serializedAccess = await accessCookie.serialize(newAccessToken)
    const serializedRefresh = await refreshCookie.serialize(newRefreshToken)

    const headers = new Headers()
    headers.append('Set-Cookie', serializedAccess)
    headers.append('Set-Cookie', serializedRefresh)

    await client.end()

    // Return to original page
    const url = new URL(request.url)
    const redirectTo = url.searchParams.get('redirectTo') || '/'
    return redirect(redirectTo, { headers })
  } catch (error) {
    await client.end()
    // Refresh token invalid/expired - force re-login
    return redirect('/login')
  }
}

// Prevent GET requests
export default function Refresh() {
  return redirect('/login')
}
