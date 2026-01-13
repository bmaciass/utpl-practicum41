import { createCookie } from '@remix-run/cloudflare'

export const getRefreshTokenCookie = (secret: string) =>
  createCookie('refresh-token-cookie', {
    httpOnly: true,
    sameSite: process.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/',
    secure: process.env.ENVIRONMENT === 'production',
    maxAge: 604800, // 7 days (1 week) - matches JWT expiration
    secrets: [secret],
  })
