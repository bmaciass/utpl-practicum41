import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client'
import { redirectToLogin, refreshSession } from '~/lib/auth.client'

declare global {
  interface Window {
    __APP_ENV__?: {
      apiUrl?: string
    }
  }
}

const DEFAULT_API_URL = 'http://localhost:6002/graphql'

function getApiUrl() {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.apiUrl) {
    return window.__APP_ENV__.apiUrl
  }

  return DEFAULT_API_URL
}

function hasAuthGraphQLError(result: {
  errors?: ReadonlyArray<{ message?: string }>
}) {
  return (
    result.errors?.some((error) =>
      /(auth|unauthor|token|cookie|session)/i.test(error.message ?? ''),
    ) ?? false
  )
}

function isUnauthorizedNetworkError(error: unknown) {
  if (!(error instanceof Error)) return false

  return /401|403|unauthor/i.test(error.message)
}

const httpLink = new HttpLink({
  // Use the UI runtime-configured API host so auth cookies stay on the same host.
  uri: getApiUrl(),
  credentials: 'include',
})

const authRecoveryLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    let subscription: { unsubscribe(): void } | undefined
    let hasRetried = false

    const run = () => {
      subscription = forward(operation).subscribe({
        next: (result) => {
          if (!hasRetried && hasAuthGraphQLError(result)) {
            hasRetried = true
            void refreshSession({ redirectOnFail: false }).then((refreshed) => {
              if (!refreshed) {
                redirectToLogin()
                observer.error(new Error('Authentication required'))
                return
              }

              run()
            })
            return
          }

          observer.next(result)
        },
        error: (error) => {
          if (!hasRetried && isUnauthorizedNetworkError(error)) {
            hasRetried = true
            void refreshSession({ redirectOnFail: false }).then((refreshed) => {
              if (!refreshed) {
                redirectToLogin()
                observer.error(error)
                return
              }

              run()
            })
            return
          }

          observer.error(error)
        },
        complete: () => observer.complete(),
      })
    }

    run()

    return () => {
      subscription?.unsubscribe()
    }
  })
})

export const apiClient = new ApolloClient({
  link: ApolloLink.from([authRecoveryLink, httpLink]),
  cache: new InMemoryCache({
    dataIdFromObject: (object: any) => object.uid || null,
    typePolicies: {
      ProgramQueries: { merge: false },
      ReportsQueries: { merge: false },
    },
  }),
})
