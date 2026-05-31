import { createRequestHandler, type ServerBuild } from '@remix-run/cloudflare'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This file won’t exist if it hasn’t yet been built
import * as build from './build/server' // eslint-disable-line import/no-unresolved
import { getLoadContext } from './load-context'
import { getRequestId, serializeError } from './app/helpers/serverError'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const handleRemixRequest = createRequestHandler(build as any as ServerBuild)

export default {
  async fetch(request, env, ctx) {
    const requestId = getRequestId(request)

    try {
      const loadContext = getLoadContext({
        request,
        context: {
          cloudflare: {
            // This object matches the return value from Wrangler's
            // `getPlatformProxy` used during development via Remix's
            // `cloudflareDevProxyVitePlugin`:
            // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
            cf: request.cf,
            ctx: {
              waitUntil: ctx.waitUntil.bind(ctx),
              passThroughOnException: ctx.passThroughOnException.bind(ctx),
            },
            caches,
            env,
          },
        },
      })
      const response = await handleRemixRequest(request, loadContext)
      response.headers.set('x-request-id', requestId)
      return response
    } catch (error) {
      console.error('[ui] Unhandled worker fetch error', {
        requestId,
        method: request.method,
        url: request.url,
        error: serializeError(error),
      })

      return new Response('An unexpected error occurred', {
        headers: {
          'x-request-id': requestId,
        },
        status: 500,
      })
    }
  },
} satisfies ExportedHandler<Env>
