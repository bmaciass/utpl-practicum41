import { DeleteGoal } from '~/application/use-cases/goal'
import {
  getGoalRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { executeAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { GoalMutations } from './root'

type TDeleteGoalInput = {
  uid: string
}

export const DeleteGoalInput = builder
  .inputRef<TDeleteGoalInput>('DeleteGoalInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

builder.objectField(GoalMutations, 'delete', (t) =>
  t.field({
    type: 'Boolean',
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: DeleteGoalInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, context, info) => {
      const { db, user } = context
      const goalRepo = getGoalRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new DeleteGoal({
        goalRepository: goalRepo,
        userRepository: userRepo,
      })

      return executeAuditedMutation({
        context,
        info,
        action: 'delete',
        resourceType: 'goal',
        resourceUid: input.uid,
        requestPayload: input,
        beforeSnapshot: () => goalRepo.findByUid(input.uid),
        afterSnapshot: async () => goalRepo.findByUid(input.uid),
        run: async () => {
          await useCase.execute({ uid: input.uid }, user.uid)
          return true
        },
      })
    },
  }),
)
