import { GetAuditEvent } from '~/application/use-cases/audit'
import { getAuditEventRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AuditEvent } from '../../objects/AuditEvent'
import { AuditQueries } from './root'

builder.objectField(AuditQueries, 'one', (t) =>
  t.field({
    type: AuditEvent,
    authScopes: { admin: true },
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, { uid }, { db }) => {
      const useCase = new GetAuditEvent({
        auditEventRepository: getAuditEventRepository(db),
      })

      return useCase.execute({ uid })
    },
  }),
)
