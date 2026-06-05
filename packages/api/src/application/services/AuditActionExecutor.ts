import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { CreatePendingAuditEvent } from '../use-cases/audit/CreatePendingAuditEvent'
import { MarkAuditEventFailed } from '../use-cases/audit/MarkAuditEventFailed'
import { MarkAuditEventSucceeded } from '../use-cases/audit/MarkAuditEventSucceeded'
import type {
  AuditAction,
  AuditResourceType,
} from '~/domain/entities/AuditEvent'
import type { IAuditEventRepository } from '~/domain/repositories/IAuditEventRepository'

interface AuditActionExecutorDeps {
  auditEventRepository: IAuditEventRepository
  userRepository: IUserRepository
}

interface ExecuteAuditActionOptions<TResult> {
  action: AuditAction
  resourceType: AuditResourceType
  resourceUid?: string | null
  actorUserUid?: string | null
  actorLabel?: string | null
  requestPayload?: unknown | null
  metadata?: unknown | null
  beforeSnapshot?: (() => Promise<unknown> | unknown) | unknown
  afterSnapshot?: ((result: TResult) => Promise<unknown> | unknown) | unknown
  getResourceUid?: (
    result: TResult,
  ) => Promise<string | null | undefined> | string | null | undefined
  run: () => Promise<TResult>
}

type JsonLike =
  | null
  | boolean
  | number
  | string
  | JsonLike[]
  | { [key: string]: JsonLike }

const REDACTED_VALUE = '[REDACTED]'
const REDACTED_KEYS = new Set([
  'password',
  'passwordhash',
  'salt',
  'accesstoken',
  'refreshtoken',
  'cookie',
  'cookies',
  'authorization',
  'bearer',
  'set-cookie',
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function extractGetterObject(value: object): Record<string, unknown> | null {
  const output: Record<string, unknown> = {}
  let current = value

  while (current && current !== Object.prototype) {
    const descriptors = Object.getOwnPropertyDescriptors(current)
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (key === 'constructor' || !descriptor.get || key in output) {
        continue
      }
      output[key] = descriptor.get.call(value)
    }
    current = Object.getPrototypeOf(current)
  }

  return Object.keys(output).length > 0 ? output : null
}

function normalizeAuditValue(value: unknown): JsonLike {
  if (value === null || value === undefined) {
    return null
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack ?? null,
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeAuditValue(item))
  }

  if (typeof value === 'object') {
    const source = isPlainObject(value)
      ? value
      : (extractGetterObject(value) ?? (value as Record<string, unknown>))

    const entries = Object.entries(source).filter(
      ([, item]) => item !== undefined,
    )

    return Object.fromEntries(
      entries.map(([key, item]) => [key, normalizeAuditValue(item)]),
    )
  }

  return String(value)
}

function getAuditLogRequestId(metadata: unknown): string | null {
  if (!isPlainObject(metadata)) return null
  const request = metadata.request
  if (!isPlainObject(request)) return null
  return typeof request.requestId === 'string' ? request.requestId : null
}

function redactAuditValue(value: JsonLike): JsonLike {
  if (value === null) {
    return null
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactAuditValue(item))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const normalizedKey = key.toLowerCase()
        if (REDACTED_KEYS.has(normalizedKey)) {
          return [key, REDACTED_VALUE]
        }
        return [key, redactAuditValue(item)]
      }),
    )
  }

  return value
}

function serializeAuditValue(value: unknown): JsonLike {
  return redactAuditValue(normalizeAuditValue(value))
}

function serializeAuditError(error: unknown): JsonLike {
  if (error instanceof Error) {
    const result: Record<string, JsonLike> = {
      name: error.name,
      message: error.message,
      stack: error.stack ?? null,
    }

    const cause = Reflect.get(error, 'cause')
    if (cause !== undefined) {
      result.cause = serializeAuditValue(cause)
    }

    return result
  }

  return serializeAuditValue(error)
}

export class AuditActionExecutor {
  private readonly createPendingAuditEvent: CreatePendingAuditEvent
  private readonly markAuditEventSucceeded: MarkAuditEventSucceeded
  private readonly markAuditEventFailed: MarkAuditEventFailed

  constructor(private deps: AuditActionExecutorDeps) {
    this.createPendingAuditEvent = new CreatePendingAuditEvent({
      auditEventRepository: deps.auditEventRepository,
    })
    this.markAuditEventSucceeded = new MarkAuditEventSucceeded({
      auditEventRepository: deps.auditEventRepository,
    })
    this.markAuditEventFailed = new MarkAuditEventFailed({
      auditEventRepository: deps.auditEventRepository,
    })
  }

  async execute<TResult>(
    options: ExecuteAuditActionOptions<TResult>,
  ): Promise<TResult> {
    const startedAt = Date.now()
    const requestId = getAuditLogRequestId(options.metadata)
    console.log('[audit] Action executor started', {
      action: options.action,
      resourceType: options.resourceType,
      hasResourceUid: Boolean(options.resourceUid),
      hasActorUserUid: Boolean(options.actorUserUid),
      requestId,
    })

    const actorUser = options.actorUserUid
      ? await this.deps.userRepository.findByUid(options.actorUserUid)
      : null
    console.log('[audit] Action executor actor resolved', {
      action: options.action,
      resourceType: options.resourceType,
      hasActorUser: Boolean(actorUser),
      requestId,
      durationMs: Date.now() - startedAt,
    })

    const auditEvent = await this.createPendingAuditEvent.execute({
      action: options.action,
      resourceType: options.resourceType,
      resourceUid: options.resourceUid,
      actorUserId: actorUser?.id ?? null,
      actorLabel: options.actorLabel ?? null,
      requestPayload: serializeAuditValue(options.requestPayload),
      metadata: serializeAuditValue(options.metadata),
    })
    console.log('[audit] Action executor pending event created', {
      action: options.action,
      resourceType: options.resourceType,
      auditEventUid: auditEvent.uid,
      requestId,
      durationMs: Date.now() - startedAt,
    })

    let beforeSnapshot: JsonLike = null

    try {
      console.log('[audit] Action executor running action', {
        action: options.action,
        resourceType: options.resourceType,
        auditEventUid: auditEvent.uid,
        requestId,
        durationMs: Date.now() - startedAt,
      })
      beforeSnapshot =
        typeof options.beforeSnapshot === 'function'
          ? serializeAuditValue(await options.beforeSnapshot())
          : serializeAuditValue(options.beforeSnapshot)

      const result = await options.run()
      console.log('[audit] Action executor action returned', {
        action: options.action,
        resourceType: options.resourceType,
        auditEventUid: auditEvent.uid,
        requestId,
        durationMs: Date.now() - startedAt,
      })
      const afterSnapshot =
        typeof options.afterSnapshot === 'function'
          ? serializeAuditValue(await options.afterSnapshot(result))
          : serializeAuditValue(options.afterSnapshot)
      const resourceUid = options.getResourceUid
        ? ((await options.getResourceUid(result)) ??
          options.resourceUid ??
          null)
        : (options.resourceUid ?? null)

      await this.markAuditEventSucceeded.execute({
        uid: auditEvent.uid,
        resourceUid,
        beforeSnapshot,
        afterSnapshot,
        metadata: serializeAuditValue(options.metadata),
      })
      console.log('[audit] Action executor succeeded', {
        action: options.action,
        resourceType: options.resourceType,
        auditEventUid: auditEvent.uid,
        requestId,
        durationMs: Date.now() - startedAt,
      })

      return result
    } catch (error) {
      console.error('[audit] Action executor action threw', {
        action: options.action,
        resourceType: options.resourceType,
        auditEventUid: auditEvent.uid,
        requestId,
        durationMs: Date.now() - startedAt,
        error,
      })
      await this.markAuditEventFailed.execute({
        uid: auditEvent.uid,
        resourceUid: options.resourceUid ?? null,
        beforeSnapshot,
        error: serializeAuditError(error),
        metadata: serializeAuditValue(options.metadata),
      })
      console.error('[audit] Action executor failed', {
        action: options.action,
        resourceType: options.resourceType,
        auditEventUid: auditEvent.uid,
        requestId,
        durationMs: Date.now() - startedAt,
        error,
      })

      throw error
    }
  }
}

export { REDACTED_VALUE, serializeAuditValue, serializeAuditError }
