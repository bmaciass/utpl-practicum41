import type { Db } from '@sigep/db'
import { AuditActionExecutor } from './AuditActionExecutor'
import type { AuditResourceType } from '~/domain/entities/AuditEvent'
import { DrizzleAuditEventRepository } from '~/infrastructure/persistence/drizzle/repositories/DrizzleAuditEventRepository'
import { DrizzleUserRepository } from '~/infrastructure/persistence/drizzle/repositories/DrizzleUserRepository'

interface AuditedActionContext {
  db: Db
  request: Request
}

type AnyAuditedAction<
  TContext extends AuditedActionContext = AuditedActionContext,
> = (input: any, context: TContext) => Promise<any>
type ActionInput<TAction extends AnyAuditedAction> = Parameters<TAction>[0]
type ActionContext<TAction extends AnyAuditedAction> = Parameters<TAction>[1]
type ActionResult<TAction extends AnyAuditedAction> = Awaited<
  ReturnType<TAction>
>

interface AuditedActionConfig<TAction extends AnyAuditedAction> {
  action: string
  resourceType: AuditResourceType
  routeName: string
  getRequestPayload?: (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ) => unknown
  getInitialResourceUid?: (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ) => Promise<string | null | undefined> | string | null | undefined
  getActorUserUid?: (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ) => Promise<string | null | undefined> | string | null | undefined
  getActorLabel?: (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ) => Promise<string | null | undefined> | string | null | undefined
  getResourceUid?: (
    input: ActionInput<TAction>,
    result: ActionResult<TAction>,
    context: ActionContext<TAction>,
  ) => Promise<string | null | undefined> | string | null | undefined
  loadBefore?: (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ) => Promise<unknown> | unknown
  getAfterSnapshot?: (
    input: ActionInput<TAction>,
    result: ActionResult<TAction>,
    context: ActionContext<TAction>,
  ) => Promise<unknown> | unknown
  getMetadata?: (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ) =>
    | Promise<Record<string, unknown> | null | undefined>
    | Record<string, unknown>
    | null
    | undefined
}

function getRequestMetadata(request: Request) {
  return {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    requestId:
      request.headers.get('x-request-id') ?? request.headers.get('cf-ray'),
  }
}

export function createRouteAuditMetadata(
  routeName: string,
  request: Request,
  extra?: Record<string, unknown> | null,
) {
  return {
    transport: 'http_route',
    route: {
      name: routeName,
    },
    request: getRequestMetadata(request),
    ...(extra ?? {}),
  }
}

export function withAuditedAction<TAction extends AnyAuditedAction>(
  config: AuditedActionConfig<TAction>,
  action: TAction,
): TAction {
  return (async (
    input: ActionInput<TAction>,
    context: ActionContext<TAction>,
  ): Promise<ActionResult<TAction>> => {
    const executor = new AuditActionExecutor({
      auditEventRepository: new DrizzleAuditEventRepository(context.db),
      userRepository: new DrizzleUserRepository(context.db),
    })

    const metadata = createRouteAuditMetadata(
      config.routeName,
      context.request,
      (await config.getMetadata?.(input, context)) ?? null,
    )

    return executor.execute<ActionResult<TAction>>({
      action: config.action,
      resourceType: config.resourceType,
      resourceUid: config.getInitialResourceUid
        ? ((await config.getInitialResourceUid(input, context)) ?? null)
        : null,
      actorUserUid: config.getActorUserUid
        ? ((await config.getActorUserUid(input, context)) ?? null)
        : null,
      actorLabel: config.getActorLabel
        ? ((await config.getActorLabel(input, context)) ?? null)
        : null,
      requestPayload: config.getRequestPayload
        ? config.getRequestPayload(input, context)
        : input,
      beforeSnapshot: config.loadBefore
        ? () => config.loadBefore!(input, context)
        : null,
      afterSnapshot: config.getAfterSnapshot
        ? (result: ActionResult<TAction>) =>
            config.getAfterSnapshot!(input, result, context)
        : null,
      getResourceUid: config.getResourceUid
        ? (result: ActionResult<TAction>) =>
            config.getResourceUid!(input, result, context)
        : undefined,
      metadata,
      run: () => action(input, context),
    })
  }) as TAction
}
