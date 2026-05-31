type ErrorLogMetadata = Record<string, unknown>

export function getRequestId(request: Request) {
  return request.headers.get('cf-ray') ?? crypto.randomUUID()
}

export function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  return {
    message: typeof error === 'string' ? error : 'Unknown non-Error value',
    name: typeof error,
    stack: undefined,
  }
}

export function logServerError(
  message: string,
  request: Request,
  error: unknown,
  metadata: ErrorLogMetadata = {},
) {
  const requestId = getRequestId(request)

  console.error(message, {
    requestId,
    method: request.method,
    url: request.url,
    error: serializeError(error),
    ...metadata,
  })

  return requestId
}
