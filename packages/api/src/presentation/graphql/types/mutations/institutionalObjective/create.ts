import { CreateInstitutionalObjective } from '~/application/use-cases/institutional-objective'
import {
  getInstitutionRepository,
  getInstitutionalObjectiveRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionalObjective } from '../../objects/InstitutionalObjective'
import { InstitutionalObjectiveMutations } from './root'

type TCreateInstitutionalObjectiveDataInput = {
  name: string
  description: string
  institutionId: string
}

export const CreateInstitutionalObjectiveDataInput = builder
  .inputRef<TCreateInstitutionalObjectiveDataInput>(
    'CreateInstitutionalObjectiveDataInput',
  )
  .implement({
    fields: (t) => ({
      name: t.string(),
      description: t.string({ required: true }),
      institutionId: t.string(),
    }),
  })

builder.objectField(InstitutionalObjectiveMutations, 'create', (t) =>
  t.field({
    type: InstitutionalObjective,
    authScopes: { protected: true },
    args: {
      data: t.arg({
        type: CreateInstitutionalObjectiveDataInput,
        required: true,
      }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const institutionalObjectiveRepository =
        getInstitutionalObjectiveRepository(db)
      const institutionRepository = getInstitutionRepository(db)
      const userRepository = getUserRepository(db)

      const createObjective = new CreateInstitutionalObjective({
        institutionalObjectiveRepository,
        institutionRepository,
        userRepository,
      })

      const objective = await createObjective.execute(
        {
          name: data.name,
          description: data.description,
          institutionUid: data.institutionId,
        },
        user.uid,
      )

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
