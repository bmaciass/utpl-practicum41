import { GetInstitutionById } from '~/application/use-cases/institution'
import { getInstitutionRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Institution } from '../../objects/Institution'
import { InstitutionQueries } from './root'

builder.objectField(InstitutionQueries, 'one', (t) =>
  t.field({
    type: Institution,
    nullable: true,
    authScopes: { protected: true },
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, { id }, { db }) => {
      const institutionRepository = getInstitutionRepository(db)
      const getInstitutionById = new GetInstitutionById({
        institutionRepository,
      })

      const institution = await getInstitutionById.execute(id)
      if (!institution) return null

      return { ...institution, objetives: [] }
    },
  }),
)
