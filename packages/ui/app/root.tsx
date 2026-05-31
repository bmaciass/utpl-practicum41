import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { data } from '@remix-run/cloudflare'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react'
import { RefreshCcw, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'

import { AuthSessionManager } from './components/globals/AuthSessionManager'
import { Button } from './components/ui/button'
import { AppEnvProvider } from './context/AppEnv'
import {
  getFriendlyApplicationError,
  logRouteErrorToConsole,
} from './helpers/applicationError'
import './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export const loader = ({ context }: LoaderFunctionArgs) => {
  return data({
    apiUrl: context.cloudflare.env.API_GRAPHQL_URL,
  })
}

export function Layout ({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>('root')

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APP_ENV__ = ${JSON.stringify(loaderData ?? {})};`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// const InternalIndex = () => {
//   const { apiUrl } = useAppEnv()
//   const apiClient = new ApolloClient({
//     uri: apiUrl,
//     cache: new InMemoryCache(),
//     credentials: 'include' // using with cookies
//   })
//   return (
//     <ApolloProvider client={apiClient}><Outlet /></ApolloProvider>
//   )
// }

export default function App () {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <AppEnvProvider data={loaderData}>
      <AuthSessionManager />
      <Outlet />
    </AppEnvProvider>
  )
}

export function ErrorBoundary () {
  const error = useRouteError()
  const friendlyError = getFriendlyApplicationError(error)

  useEffect(() => {
    logRouteErrorToConsole(error)
  }, [error])

  return (
    <main className='min-h-screen bg-slate-950 px-6 py-12 text-slate-50'>
      <div className='mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl items-center justify-center'>
        <section className='w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur'>
          <div className='border-b border-white/10 bg-gradient-to-r from-rose-500/20 via-orange-400/10 to-transparent px-8 py-6'>
            <div className='flex items-center gap-3 text-rose-200'>
              <div className='rounded-full border border-rose-300/30 bg-rose-400/10 p-3'>
                <TriangleAlert className='size-6' />
              </div>
              <div>
                <p className='text-sm font-medium uppercase tracking-[0.3em] text-rose-100/80'>
                  SIGEP
                </p>
                <h1 className='text-3xl font-semibold tracking-tight text-white'>
                  {friendlyError.heading}
                </h1>
              </div>
            </div>
          </div>

          <div className='space-y-6 px-8 py-8'>
            <p className='max-w-2xl text-base leading-7 text-slate-200'>
              {friendlyError.message}
            </p>

            {friendlyError.statusCode ? (
              <div className='inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200'>
                <span className='font-semibold text-white'>
                  {friendlyError.statusCode}
                </span>
                <span className='text-slate-300'>
                  {friendlyError.statusText ??
                    (isRouteErrorResponse(error)
                      ? error.statusText
                      : 'Unexpected error')}
                </span>
              </div>
            ) : null}

            {friendlyError.requestId ? (
              <p className='text-sm text-slate-400'>
                Request ID: <code>{friendlyError.requestId}</code>
              </p>
            ) : null}

            <div className='flex flex-wrap gap-3'>
              <Button asChild size='lg'>
                <Link to='/'>Go to home</Link>
              </Button>
              <Button
                className='border-white/15 bg-white/5 text-white hover:bg-white/10'
                onClick={() => window.location.reload()}
                size='lg'
                type='button'
                variant='outline'
              >
                <RefreshCcw className='size-4' />
                Reload page
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
