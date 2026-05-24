import type { GraphQLResolveInfo } from 'graphql'
import { AuditActionExecutor } from '~/application/services/AuditActionExecutor'
import type { AuditResourceType } from '~/domain/entities/AuditEvent'
import {
  getAuditEventRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import type { AppContext } from '../schema/context'

interface ExecuteAuditedMutationOptions<TResult> {
  context: AppContext
  info: GraphQLResolveInfo
  action: string
  resourceType: AuditResourceType
  requestPayload?: unknown
  resourceUid?: string | null
  actorLabel?: string | null
  beforeSnapshot?: (() => Promise<unknown> | unknown) | unknown
  afterSnapshot?: ((result: TResult) => Promise<unknown> | unknown) | unknown
  getResourceUid?: (result: TResult) => string | null | undefined
  run: () => Promise<TResult>
}

function getRequestMetadata(context: AppContext) {
  return {
    method: context.request.method,
    url: context.request.url,
    userAgent: context.request.headers.get('user-agent'),
    requestId:
      context.request.headers.get('x-request-id') ??
      context.request.headers.get('cf-ray'),
  }
}

export function createGraphQLAuditMetadata(
  context: AppContext,
  info: GraphQLResolveInfo,
) {
  return {
    transport: 'graphql',
    graphql: {
      operationName: info.operation.name?.value ?? null,
      fieldName: info.fieldName,
      parentType: info.parentType.name,
    },
    request: getRequestMetadata(context),
  }
}

export async function executeAuditedMutation<TResult>(
  options: ExecuteAuditedMutationOptions<TResult>,
): Promise<TResult> {
  const executor = new AuditActionExecutor({
    auditEventRepository: getAuditEventRepository(options.context.db),
    userRepository: getUserRepository(options.context.db),
  })

  return executor.execute({
    action: options.action,
    resourceType: options.resourceType,
    resourceUid: options.resourceUid ?? null,
    actorUserUid: options.context.user.uid || null,
    actorLabel: options.actorLabel ?? null,
    requestPayload: options.requestPayload,
    beforeSnapshot: options.beforeSnapshot,
    afterSnapshot: options.afterSnapshot,
    getResourceUid: options.getResourceUid,
    metadata: createGraphQLAuditMetadata(options.context, options.info),
    run: options.run,
  })
}
