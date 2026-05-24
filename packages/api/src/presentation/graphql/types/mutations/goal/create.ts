import { CreateGoal } from '~/application/use-cases/goal'
import {
  getGoalRepository,
  getInstitutionalObjectiveRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { Goal } from '../../objects/Goal'
import { GoalMutations } from './root'

type TCreateGoalDataInput = {
  name: string
  description: string
  institutionalObjectiveUid: string
}

export const CreateGoalDataInput = builder
  .inputRef<TCreateGoalDataInput>('CreateGoalDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.string({ required: true }),
      institutionalObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(GoalMutations, 'create', (t) =>
  t.field({
    type: Goal,
    authScopes: { protected: true },
    args: {
      data: t.arg({
        type: CreateGoalDataInput,
        required: true,
      }),
    },
    resolve: withAuditedMutation(
      {
        action: 'create',
        resourceType: 'goal',
        getRequestPayload: ({ data }) => data,
        getResourceUid: (_args, result) => result.uid,
      },
      async (_, { data }, { db, user }) => {
        const goalRepo = getGoalRepository(db)
        const institutionalObjectiveRepo =
          getInstitutionalObjectiveRepository(db)
        const userRepo = getUserRepository(db)

        const useCase = new CreateGoal({
          goalRepository: goalRepo,
          institutionalObjectiveRepository: institutionalObjectiveRepo,
          userRepository: userRepo,
        })

        return useCase.execute(data, user.uid)
      },
    ),
  }),
)
