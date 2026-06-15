import { createCookie } from '@remix-run/cloudflare'
import { getAuthCookieOptions } from '~/cookies/auth-cookie-options.server'

type AccessTokenExpiryCookieArgs = {
  environment?: string
  request: Request
}

export const getAccessTokenExpiryCookie = ({
  environment,
  request,
}: AccessTokenExpiryCookieArgs) =>
  createCookie('access-token-expiry', {
    httpOnly: false,
    path: '/',
    maxAge: 600,
    ...getAuthCookieOptions({ environment, request }),
  })
