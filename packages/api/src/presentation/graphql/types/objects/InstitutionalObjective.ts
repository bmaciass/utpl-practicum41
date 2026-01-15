import type { InstitutionEstrategicObjetiveRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { Institution } from './Institution'

export type TInstitutionalObjective = Pick<
  InstitutionEstrategicObjetiveRecord,
  'id' | 'uid' | 'name' | 'description' | 'deletedAt' | 'institutionId'
> & {
  active: boolean
}

export const InstitutionalObjectiveRef =
  builder.objectRef<TInstitutionalObjective>('InstitutionalObjective')

export const InstitutionalObjective = InstitutionalObjectiveRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (objective) => objective.deletedAt === null,
    }),

    // Field resolver - only executes when client requests this field
    // Uses DataLoader to automatically batch Institution queries
    institution: t.field({
      type: Institution,
      resolve: async (objective, _args, { loaders }) => {
        // DataLoader batches multiple load() calls into a single DB query
        return await loaders.institution.load(objective.institutionId)
      },
    }),
  }),
})
