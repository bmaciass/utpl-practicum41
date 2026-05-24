import { ListAuditEvents } from '~/application/use-cases/audit'
import { getAuditEventRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AuditEventStatusEnum } from '../../enums/AuditEventStatus'
import { AuditResourceTypeEnum } from '../../enums/AuditResourceType'
import { AuditEvent, type TAuditEvent } from '../../objects/AuditEvent'
import { AuditQueries } from './root'

type TAuditEventFiltersInput = {
  status?: 'pending' | 'succeeded' | 'failed'
  action?: string
  resourceType?:
    | 'user'
    | 'project'
    | 'program'
    | 'goal'
    | 'indicator'
    | 'institution'
    | 'institutional_plan'
    | 'institutional_objective'
    | 'objective_pnd'
    | 'objective_ods'
    | 'project_objective'
    | 'project_task'
    | 'alignment_institutional_pnd'
    | 'alignment_pnd_ods'
    | 'alignment_project_objective_ods'
    | 'auth_session'
  resourceUid?: string
  actorLabel?: string
}

const AuditEventFiltersInput = builder
  .inputRef<TAuditEventFiltersInput>('AuditEventFiltersInput')
  .implement({
    fields: (t) => ({
      status: t.field({ type: AuditEventStatusEnum, required: false }),
      action: t.string({ required: false }),
      resourceType: t.field({ type: AuditResourceTypeEnum, required: false }),
      resourceUid: t.string({ required: false }),
      actorLabel: t.string({ required: false }),
    }),
  })

type TAuditEventListResponse = {
  total: number
  records: TAuditEvent[]
}

export const AuditEventListResponse = builder
  .objectRef<TAuditEventListResponse>('AuditEventListResponse')
  .implement({
    fields: (t) => ({
      total: t.exposeInt('total'),
      records: t.expose('records', { type: [AuditEvent] }),
    }),
  })

builder.objectField(AuditQueries, 'list', (t) =>
  t.field({
    type: AuditEventListResponse,
    authScopes: { admin: true },
    args: {
      filters: t.arg({ type: AuditEventFiltersInput, required: false }),
      limit: t.arg.int({ required: false }),
      offset: t.arg.int({ required: false }),
    },
    resolve: async (_, { filters, limit, offset }, { db }) => {
      const useCase = new ListAuditEvents({
        auditEventRepository: getAuditEventRepository(db),
      })

      return useCase.execute({
        filters: {
          status: filters?.status ?? undefined,
          action: filters?.action ?? undefined,
          resourceType: filters?.resourceType ?? undefined,
          resourceUid: filters?.resourceUid ?? undefined,
          actorLabel: filters?.actorLabel ?? undefined,
        },
        limit: limit ?? 50,
        offset: offset ?? 0,
      })
    },
  }),
)
