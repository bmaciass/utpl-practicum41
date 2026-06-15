type AuthCookieOptionsArgs = {
  environment?: string
  request: Request
}

export function getAuthCookieOptions({
  environment,
  request,
}: AuthCookieOptionsArgs) {
  const isProduction = environment === 'production'

  return {
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    domain: isProduction ? new URL(request.url).hostname : undefined,
  } as const
}
