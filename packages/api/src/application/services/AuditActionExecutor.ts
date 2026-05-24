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
  metadata?: Record<string, unknown> | null
  beforeSnapshot?: (() => Promise<unknown> | unknown) | unknown
  afterSnapshot?: ((result: TResult) => Promise<unknown> | unknown) | unknown
  getResourceUid?: (result: TResult) => string | null | undefined
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
      : extractGetterObject(value) ?? (value as Record<string, unknown>)

    const entries = Object.entries(source).filter(([, item]) => item !== undefined)

    return Object.fromEntries(
      entries.map(([key, item]) => [key, normalizeAuditValue(item)]),
    )
  }

  return String(value)
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
    const actorUser = options.actorUserUid
      ? await this.deps.userRepository.findByUid(options.actorUserUid)
      : null

    const auditEvent = await this.createPendingAuditEvent.execute({
      action: options.action,
      resourceType: options.resourceType,
      resourceUid: options.resourceUid,
      actorUserId: actorUser?.id ?? null,
      actorLabel: options.actorLabel ?? null,
      requestPayload: serializeAuditValue(options.requestPayload),
      metadata: serializeAuditValue(options.metadata),
    })

    let beforeSnapshot: JsonLike = null

    try {
      beforeSnapshot =
        typeof options.beforeSnapshot === 'function'
          ? serializeAuditValue(await options.beforeSnapshot())
          : serializeAuditValue(options.beforeSnapshot)

      const result = await options.run()
      const afterSnapshot =
        typeof options.afterSnapshot === 'function'
          ? serializeAuditValue(await options.afterSnapshot(result))
          : serializeAuditValue(options.afterSnapshot)

      await this.markAuditEventSucceeded.execute({
        uid: auditEvent.uid,
        resourceUid:
          options.getResourceUid?.(result) ?? options.resourceUid ?? null,
        beforeSnapshot,
        afterSnapshot,
        metadata: serializeAuditValue(options.metadata),
      })

      return result
    } catch (error) {
      await this.markAuditEventFailed.execute({
        uid: auditEvent.uid,
        resourceUid: options.resourceUid ?? null,
        beforeSnapshot,
        error: serializeAuditError(error),
        metadata: serializeAuditValue(options.metadata),
      })

      throw error
    }
  }
}

export { REDACTED_VALUE, serializeAuditValue, serializeAuditError }
