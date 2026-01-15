import { DeleteObjectivePND } from '~/application/use-cases/objective-pnd'
import {
  getObjectivePNDRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ObjectivePNDMutations } from './root'

type TDeleteObjectivePNDInput = {
  uid: string
}

export const DeleteObjectivePNDInput = builder
  .inputRef<TDeleteObjectivePNDInput>('DeleteObjectivePNDInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

builder.objectField(ObjectivePNDMutations, 'delete', (t) =>
  t.field({
    type: 'Boolean',
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: DeleteObjectivePNDInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, { db, user }) => {
      const pndRepo = getObjectivePNDRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new DeleteObjectivePND({
        objectivePNDRepository: pndRepo,
        userRepository: userRepo,
      })

      await useCase.execute({ uid: input.uid }, user.uid)

      return true
    },
  }),
)
