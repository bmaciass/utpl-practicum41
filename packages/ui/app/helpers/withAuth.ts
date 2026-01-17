// app/utils/withAuth.ts
import {
  type LoaderFunction,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/cloudflare'
import { getDefaultJWTService } from '@sigep/api'
import { getAccessTokenCookie } from '~/cookies/access-token.server'

type ProtectedLoader<LR = unknown> = (
  args: LoaderFunctionArgs,
) => LR | Promise<LR>

type AuthPayload = NonNullable<
  Awaited<
    ReturnType<
      Awaited<ReturnType<typeof getDefaultJWTService>>['verifyAccessToken']
    >
  >
>

async function getAuthPayloadResult(
  args: LoaderFunctionArgs,
): Promise<AuthPayload | Response> {
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

  const jwtService = await getDefaultJWTService()
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

  return payload
}

export function withAuth<LR>(
  loaderFunction?: ProtectedLoader<LR>,
): LoaderFunction {
  return async (args) => {
    const result = await getAuthPayloadResult(args)
    if (result instanceof Response) {
      return result
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

export async function requireAuthPayload(
  args: LoaderFunctionArgs,
): Promise<AuthPayload | Response> {
  return getAuthPayloadResult(args)
}

export function withRole<LR>(
  role: string,
  loaderFunction?: ProtectedLoader<LR>,
): LoaderFunction {
  return async (args) => {
    const result = await getAuthPayloadResult(args)
    if (result instanceof Response) {
      return result
    }

    if (!result.roles?.includes(role)) {
      return redirect('/home')
    }

    if (loaderFunction) {
      const output = await loaderFunction({ ...args })
      return output as unknown as Response
    }
    return null
  }
}
