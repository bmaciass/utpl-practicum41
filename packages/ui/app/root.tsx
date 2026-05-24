import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { data } from '@remix-run/cloudflare'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'

import './tailwind.css'
import { AuthSessionManager } from './components/globals/AuthSessionManager'
import { AppEnvProvider } from './context/AppEnv'

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

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>()

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
            __html: `window.__APP_ENV__ = ${JSON.stringify(loaderData)};`,
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

export default function App() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <AppEnvProvider data={loaderData}>
      <AuthSessionManager />
      <Outlet />
    </AppEnvProvider>
  )
}
