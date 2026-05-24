import { DeleteUser } from '~/application/use-cases/user'
import { getUserRepository } from '~/infrastructure/persistence/drizzle/repositories'
import { executeAuditedMutation } from '../../../helpers/audit'
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
    resolve: async (_, { input }, context, info) => {
      const { db, user } = context
      const userRepository = getUserRepository(db)
      const useCase = new DeleteUser({ userRepository })

      return executeAuditedMutation({
        context,
        info,
        action: 'delete',
        resourceType: 'user',
        resourceUid: input.uid,
        requestPayload: input,
        beforeSnapshot: () => userRepository.findByUid(input.uid),
        afterSnapshot: async () => userRepository.findByUid(input.uid),
        run: async () => {
          await useCase.execute({ uid: input.uid }, user.uid)
          return true
        },
      })
    },
  }),
)
