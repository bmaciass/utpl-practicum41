import { ListInstitutions } from '~/application/use-cases/institution'
import { getInstitutionRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import { Institution, type TInstitution } from '../../objects/Institution'
import { InstitutionQueries } from './root'

export type TInstitutionsQueryResponse = {
  records: TInstitution[]
}

export const InstitutionsQueryResponse = builder
  .objectRef<TInstitutionsQueryResponse>('InstitutionsQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [Institution] }),
    }),
  })

builder.objectField(InstitutionQueries, 'list', (t) =>
  t.field({
    type: InstitutionsQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
    },
    resolve: async (_, args, { db }) => {
      const institutionRepository = getInstitutionRepository(db)
      const listInstitutions = new ListInstitutions({ institutionRepository })

      const institutions = await listInstitutions.execute({
        filters: {
          active: args.active ?? undefined,
          name: args.name
            ? { contains: args.name.contains ?? undefined }
            : undefined,
        },
      })

      return {
        records: institutions.map((i) => ({ ...i, objetives: [] })),
      }
    },
  }),
)
