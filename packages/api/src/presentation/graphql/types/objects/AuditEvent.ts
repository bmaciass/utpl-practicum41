import type { AuditEvent as AuditEventModel } from '~/domain/entities/AuditEvent'
import builder from '../../schema/builder'
import { AuditEventStatusEnum } from '../enums/AuditEventStatus'
import { AuditResourceTypeEnum } from '../enums/AuditResourceType'
import { User } from './User'

export type TAuditEvent = AuditEventModel

export const AuditEvent = builder.objectRef<TAuditEvent>('AuditEvent').implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    status: t.expose('status', { type: AuditEventStatusEnum }),
    action: t.exposeString('action'),
    resourceType: t.expose('resourceType', { type: AuditResourceTypeEnum }),
    resourceUid: t.exposeString('resourceUid', { nullable: true }),
    actorLabel: t.exposeString('actorLabel', { nullable: true }),
    actorUser: t.field({
      type: User,
      nullable: true,
      resolve: async (event, _, { loaders }) => {
        if (!event.actorUserId) {
          return null
        }

        return loaders.user.load(event.actorUserId)
      },
    }),
    requestPayload: t.expose('requestPayload', { type: 'JSON', nullable: true }),
    beforeSnapshot: t.expose('beforeSnapshot', { type: 'JSON', nullable: true }),
    afterSnapshot: t.expose('afterSnapshot', { type: 'JSON', nullable: true }),
    error: t.expose('error', { type: 'JSON', nullable: true }),
    metadata: t.expose('metadata', { type: 'JSON', nullable: true }),
  }),
})
