import { ListInstitutionalObjective } from '~/application/use-cases/institutional-objective'
import {
  getInstitutionRepository,
  getInstitutionalObjectiveRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import {
  InstitutionalObjective,
  type TInstitutionalObjective,
} from '../../objects/InstitutionalObjective'
import { InstitutionalObjectiveQueries } from './root'

export type TInstitutionalObjectivesQueryResponse = {
  records: TInstitutionalObjective[]
}

export const InstitutionalObjectivesQueryResponse = builder
  .objectRef<TInstitutionalObjectivesQueryResponse>(
    'InstitutionalObjectivesQueryResponse',
  )
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [InstitutionalObjective] }),
    }),
  })

builder.objectField(InstitutionalObjectiveQueries, 'list', (t) =>
  t.field({
    type: InstitutionalObjectivesQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
      institutionUid: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { db }) => {
      const institutionRepository = getInstitutionRepository(db)
      const institutionalObjectiveRepository =
        getInstitutionalObjectiveRepository(db)

      let institutionId: number | undefined

      if (args.institutionUid) {
        const institution = await institutionRepository.findByUid(
          args.institutionUid,
        )
        if (institution) {
          institutionId = institution.id
        }
      }

      const listObjectives = new ListInstitutionalObjective({
        institutionalObjectiveRepository,
      })

      const objectives = await listObjectives.execute({
        where: {
          active: args.active ?? undefined,
          name: typeof args.name === 'string' ? args.name : undefined,
          institutionId,
        },
      })

      return {
        records: objectives.map((objective) => ({
          id: objective.id,
          uid: objective.uid,
          name: objective.name,
          description: objective.description,
          active: objective.active,
          deletedAt: objective.deletedAt,
          institutionId: objective.institutionId,
        })),
      }
    },
  }),
)
