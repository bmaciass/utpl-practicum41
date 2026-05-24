import { DeleteUser } from '~/application/use-cases/user'
import { getUserRepository } from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { UserMutations } from './root'

type DeleteUserInputType = {
  uid: string
}

export const DeleteUserInput = builder
  .inputRef<DeleteUserInputType>('DeleteUserInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

builder.objectField(UserMutations, 'delete', (t) =>
  t.field({
    type: 'Boolean',
    authScopes: { protected: true },
    args: {
      input: t.arg({ type: DeleteUserInput, required: true }),
    },
    resolve: withAuditedMutation(
      {
        action: 'delete',
        resourceType: 'user',
        getRequestPayload: ({ input }) => input,
        getInitialResourceUid: ({ input }) => input.uid,
        loadBefore: async ({ input }, { db }) =>
          getUserRepository(db).findByUid(input.uid),
        getAfterSnapshot: async ({ input }, _result, { db }) =>
          getUserRepository(db).findByUid(input.uid),
      },
      async (_, { input }, { db, user }) => {
        const userRepository = getUserRepository(db)
        const useCase = new DeleteUser({ userRepository })

        await useCase.execute({ uid: input.uid }, user.uid)
        return true
      },
    ),
  }),
)
