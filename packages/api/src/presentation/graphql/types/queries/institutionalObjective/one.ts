import { GetInstitutionalObjectiveById } from '~/application/use-cases/institutional-objective'
import { getInstitutionalObjectiveRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import {
  InstitutionalObjective,
  type TInstitutionalObjective,
} from '../../objects/InstitutionalObjective'
import { InstitutionalObjectiveQueries } from './root'

builder.objectField(InstitutionalObjectiveQueries, 'one', (t) =>
  t.field({
    type: InstitutionalObjective,
    authScopes: { protected: true },
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { db }): Promise<TInstitutionalObjective> => {
      const institutionalObjectiveRepository =
        getInstitutionalObjectiveRepository(db)

      const getObjective = new GetInstitutionalObjectiveById({
        institutionalObjectiveRepository,
      })

      const objective = await getObjective.execute(args.uid)

      return {
        id: objective.id,
        uid: objective.uid,
        name: objective.name,
        description: objective.description,
        active: objective.active,
        deletedAt: objective.deletedAt,
        institutionId: objective.institutionId,
      }
    },
  }),
)
