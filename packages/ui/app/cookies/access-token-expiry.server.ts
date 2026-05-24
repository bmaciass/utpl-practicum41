import { createCookie } from '@remix-run/cloudflare'

export const getAccessTokenExpiryCookie = () =>
  createCookie('access-token-expiry', {
    httpOnly: false,
    sameSite: process.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
    path: '/',
    secure: process.env.ENVIRONMENT === 'production',
    maxAge: 600,
  })
