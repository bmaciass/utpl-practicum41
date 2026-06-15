import { createCookie } from '@remix-run/cloudflare'
import { getAuthCookieOptions } from '~/cookies/auth-cookie-options.server'

type RefreshTokenCookieArgs = {
  secret: string
  environment?: string
  request: Request
}

export const getRefreshTokenCookie = ({
  secret,
  environment,
  request,
}: RefreshTokenCookieArgs) =>
  createCookie('refresh-token-cookie', {
    httpOnly: true,
    path: '/',
    maxAge: 604800, // 7 days (1 week) - matches JWT expiration
    secrets: [secret],
    ...getAuthCookieOptions({ environment, request }),
  })
