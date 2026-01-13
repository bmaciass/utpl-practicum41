// app/utils/withAuth.ts
import {
  type LoaderFunction,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/cloudflare'
import { JWTService } from '@sigep/api'
import { getAccessTokenCookie } from '~/cookies/access-token.server'

type ProtectedLoader<LR = unknown> = (
  args: LoaderFunctionArgs,
) => LR | Promise<LR>

export function withAuth<LR>(
  loaderFunction?: ProtectedLoader<LR>,
): LoaderFunction {
  return async (args) => {
    const { context, request } = args
    const cookieString = request.headers.get('Cookie')

    // No cookies? Redirect to login
    if (!cookieString) {
      return redirect('/login')
    }

    const accessCookie = getAccessTokenCookie(
      context.cloudflare.env.UI_AUTH_COOKIE_SECRET,
    )

    // Parse access token from cookie
    const token = await accessCookie.parse(cookieString)
    if (!token) {
      return redirect('/login')
    }

    const jwtService = new JWTService()
    const payload = await jwtService.verifyAccessToken(token)

    if (!payload) {
      // Access token expired/invalid - attempt refresh
      const currentPath = new URL(request.url).pathname
      const currentSearch = new URL(request.url).search
      const redirectTo = encodeURIComponent(currentPath + currentSearch)

      return redirect(`/refresh?redirectTo=${redirectTo}`, {
        status: 303, // See Other - forces POST to GET redirect
      })
    }

    // Token valid - execute protected loader
    if (loaderFunction) {
      const result = await loaderFunction({ ...args })
      // allow you to return data or a Response
      return result as unknown as Response
    }
    return null
  }
}
