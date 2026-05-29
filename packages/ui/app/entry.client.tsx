/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { ApolloProvider } from '@apollo/client/react/index.js'
import { RemixBrowser } from '@remix-run/react'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { apiClient } from './apollo/apiClient'
import {
  logUnhandledPromiseRejection,
  logUnhandledWindowError,
} from './helpers/applicationError'

window.addEventListener('error', logUnhandledWindowError)
window.addEventListener('unhandledrejection', logUnhandledPromiseRejection)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ApolloProvider client={apiClient}>
        <RemixBrowser />
      </ApolloProvider>
    </StrictMode>,
  )
})
