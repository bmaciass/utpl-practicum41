import { UpdateGoal } from '~/application/use-cases/goal'
import {
  getGoalRepository,
  getInstitutionalObjectiveRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { executeAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { Goal } from '../../objects/Goal'
import { GoalMutations } from './root'

type TUpdateGoalWhereInput = {
  uid: string
}

export const UpdateGoalWhereInput = builder
  .inputRef<TUpdateGoalWhereInput>('UpdateGoalWhereInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateGoalDataInput = {
  name?: string
  description?: string
  institutionalObjectiveUid?: string
  active?: boolean
}

export const UpdateGoalDataInput = builder
  .inputRef<TUpdateGoalDataInput>('UpdateGoalDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      description: t.string(),
      institutionalObjectiveUid: t.string(),
      active: t.boolean(),
    }),
  })

builder.objectField(GoalMutations, 'update', (t) =>
  t.field({
    type: Goal,
    authScopes: { protected: true },
    args: {
      where: t.arg({
        type: UpdateGoalWhereInput,
        required: true,
      }),
      data: t.arg({
        type: UpdateGoalDataInput,
        required: true,
      }),
    },
    resolve: async (_, { where, data }, context, info) => {
      const { db, user } = context
      const goalRepo = getGoalRepository(db)
      const institutionalObjectiveRepo = getInstitutionalObjectiveRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new UpdateGoal({
        goalRepository: goalRepo,
        institutionalObjectiveRepository: institutionalObjectiveRepo,
        userRepository: userRepo,
      })

      return executeAuditedMutation({
        context,
        info,
        action: 'update',
        resourceType: 'goal',
        resourceUid: where.uid,
        requestPayload: { where, data },
        beforeSnapshot: () => goalRepo.findByUid(where.uid),
        afterSnapshot: (result) => result,
        run: () =>
          useCase.execute(
            {
              uid: where.uid,
              data: {
                active: data.active ?? undefined,
              },
            },
            user.uid,
          ),
      })
    },
  }),
)
