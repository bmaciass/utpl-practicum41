import type { GraphQLResolveInfo } from 'graphql'
import { AuditActionExecutor } from '~/application/services/AuditActionExecutor'
import type { AuditResourceType } from '~/domain/entities/AuditEvent'
import {
  getAuditEventRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import type { AppContext } from '../schema/context'

type GraphQLResolver<TArgs, TResult> = (
  parent: unknown,
  args: TArgs,
  context: AppContext,
  info: GraphQLResolveInfo,
) => Promise<TResult>

type AnyGraphQLResolver = GraphQLResolver<any, any>
type ResolverArgs<TResolver extends AnyGraphQLResolver> =
  Parameters<TResolver>[1]
type ResolverResult<TResolver extends AnyGraphQLResolver> = Awaited<
  ReturnType<TResolver>
>

interface AuditedMutationConfig<TResolver extends AnyGraphQLResolver> {
  action: string
  resourceType: AuditResourceType
  getRequestPayload?: (args: ResolverArgs<TResolver>) => unknown
  getInitialResourceUid?: (
    args: ResolverArgs<TResolver>,
    context: AppContext,
  ) => Promise<string | null | undefined> | string | null | undefined
  getActorLabel?: (
    args: ResolverArgs<TResolver>,
    context: AppContext,
  ) => Promise<string | null | undefined> | string | null | undefined
  getResourceUid?: (
    args: ResolverArgs<TResolver>,
    result: ResolverResult<TResolver>,
    context: AppContext,
  ) => Promise<string | null | undefined> | string | null | undefined
  loadBefore?: (
    args: ResolverArgs<TResolver>,
    context: AppContext,
  ) => Promise<unknown> | unknown
  getAfterSnapshot?: (
    args: ResolverArgs<TResolver>,
    result: ResolverResult<TResolver>,
    context: AppContext,
  ) => Promise<unknown> | unknown
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

export function withAuditedMutation<TResolver extends AnyGraphQLResolver>(
  config: AuditedMutationConfig<TResolver>,
  resolver: TResolver,
): TResolver {
  return (async (parent, args, context, info) => {
    const executor = new AuditActionExecutor({
      auditEventRepository: getAuditEventRepository(context.db),
      userRepository: getUserRepository(context.db),
    })

    return executor.execute<ResolverResult<TResolver>>({
      action: config.action,
      resourceType: config.resourceType,
      resourceUid: config.getInitialResourceUid
        ? ((await config.getInitialResourceUid(args, context)) ?? null)
        : null,
      actorUserUid: context.user.uid || null,
      actorLabel: config.getActorLabel
        ? ((await config.getActorLabel(args, context)) ?? null)
        : null,
      requestPayload: config.getRequestPayload
        ? config.getRequestPayload(args)
        : args,
      beforeSnapshot: config.loadBefore
        ? () => config.loadBefore!(args, context)
        : null,
      afterSnapshot: config.getAfterSnapshot
        ? (result: ResolverResult<TResolver>) =>
            config.getAfterSnapshot!(args, result, context)
        : (result: ResolverResult<TResolver>) => result,
      getResourceUid: config.getResourceUid
        ? (result: ResolverResult<TResolver>) =>
            config.getResourceUid!(args, result, context)
        : undefined,
      metadata: createGraphQLAuditMetadata(context, info),
      run: () => resolver(parent, args, context, info),
    })
  }) as TResolver
}
