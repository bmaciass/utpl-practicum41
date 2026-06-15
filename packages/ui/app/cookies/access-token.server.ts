import { createCookie } from '@remix-run/cloudflare'
import { getAuthCookieOptions } from '~/cookies/auth-cookie-options.server'

type AccessTokenCookieArgs = {
  secret: string
  environment?: string
  request: Request
}

export const getAccessTokenCookie = ({
  secret,
  environment,
  request,
}: AccessTokenCookieArgs) =>
  createCookie('access-token-cookie', {
    httpOnly: true,
    path: '/',
    maxAge: 600, // ten minutes
    secrets: [secret],
    ...getAuthCookieOptions({ environment, request }),
  })
