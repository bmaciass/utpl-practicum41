import { DeleteGoal } from '~/application/use-cases/goal'
import {
  getGoalRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
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
    resolve: withAuditedMutation(
      {
        action: 'delete',
        resourceType: 'goal',
        getRequestPayload: ({ input }) => input,
        getInitialResourceUid: ({ input }) => input.uid,
        loadBefore: async ({ input }, { db }) =>
          getGoalRepository(db).findByUid(input.uid),
        getAfterSnapshot: async ({ input }, _result, { db }) =>
          getGoalRepository(db).findByUid(input.uid),
      },
      async (_, { input }, { db, user }) => {
        const goalRepo = getGoalRepository(db)
        const userRepo = getUserRepository(db)

        const useCase = new DeleteGoal({
          goalRepository: goalRepo,
          userRepository: userRepo,
        })

        await useCase.execute({ uid: input.uid }, user.uid)
        return true
      },
    ),
  }),
)
