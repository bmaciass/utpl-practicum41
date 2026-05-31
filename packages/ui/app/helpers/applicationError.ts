import { isRouteErrorResponse } from '@remix-run/react'

type FriendlyApplicationError = {
  heading: string
  message: string
  requestId?: string
  statusCode?: number
  statusText?: string
}

const DEFAULT_ERROR: FriendlyApplicationError = {
  heading: 'Application error',
  message:
    'Something failed while rendering this page. Try refreshing it or return to the home page. Full error details were written to the browser console.',
}

const loggedObjectErrors = new WeakSet<object>()
const loggedPrimitiveErrors = new Set<string>()

function shouldLogError(error: unknown) {
  if (typeof error === 'object' && error !== null) {
    if (loggedObjectErrors.has(error)) {
      return false
    }

    loggedObjectErrors.add(error)
    return true
  }

  const key = String(error)
  if (loggedPrimitiveErrors.has(key)) {
    return false
  }

  loggedPrimitiveErrors.add(key)
  return true
}

function getRouteErrorMessage(status: number) {
  switch (status) {
    case 401:
      return 'Your session may have expired. Sign in again and retry the action.'
    case 403:
      return 'You do not have permission to access this page.'
    case 404:
      return 'The page you requested could not be found.'
    default:
      return DEFAULT_ERROR.message
  }
}

export function getFriendlyApplicationError(
  error: unknown,
): FriendlyApplicationError {
  if (isRouteErrorResponse(error)) {
    const routeErrorData =
      typeof error.data === 'object' && error.data !== null ? error.data : null
    const message =
      routeErrorData && 'message' in routeErrorData
        ? routeErrorData.message
        : getRouteErrorMessage(error.status)
    const requestId =
      routeErrorData && 'requestId' in routeErrorData
        ? routeErrorData.requestId
        : undefined

    return {
      heading: error.status === 404 ? 'Page not found' : 'Request failed',
      message:
        typeof message === 'string'
          ? message
          : getRouteErrorMessage(error.status),
      requestId: typeof requestId === 'string' ? requestId : undefined,
      statusCode: error.status,
      statusText: error.statusText,
    }
  }

  return DEFAULT_ERROR
}

export function logRouteErrorToConsole(error: unknown) {
  if (!shouldLogError(error)) {
    return
  }

  if (isRouteErrorResponse(error)) {
    console.error('[ui] Route error response', {
      data: error.data,
      error,
      status: error.status,
      statusText: error.statusText,
    })
    return
  }

  console.error('[ui] Route render error', error)
}

export function logUnhandledWindowError(event: ErrorEvent) {
  const error = event.error ?? event.message

  if (!shouldLogError(error)) {
    return
  }

  console.error('[ui] Unhandled window error', error, {
    colno: event.colno,
    filename: event.filename,
    lineno: event.lineno,
  })
}

export function logUnhandledPromiseRejection(event: PromiseRejectionEvent) {
  if (!shouldLogError(event.reason)) {
    return
  }

  console.error('[ui] Unhandled promise rejection', event.reason)
}
