import { type LoaderFunction, redirect } from '@remix-run/cloudflare'
import { getAccessTokenCookie } from '~/cookies/access-token.server'
import { getRefreshTokenCookie } from '~/cookies/refresh-token.server'

export default function Index() {
  return 'Redirecting...'
}

export const loader: LoaderFunction = async ({ context }) => {
  const secret = context.cloudflare.env.UI_AUTH_COOKIE_SECRET

  const accessTokenCookie = getAccessTokenCookie(secret)
  const refreshTokenCookie = getRefreshTokenCookie(secret)

  const clearAccessCookie = await accessTokenCookie.serialize('', {
    maxAge: 0,
    path: '/',
  })

  const clearRefreshCookie = await refreshTokenCookie.serialize('', {
    maxAge: 0,
    path: '/',
  })

  const headers = new Headers()
  headers.append('Set-Cookie', clearAccessCookie)
  headers.append('Set-Cookie', clearRefreshCookie)

  return redirect('/', { headers })
}
