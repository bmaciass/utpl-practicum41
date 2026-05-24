import { DeleteIndicator } from '~/application/use-cases/indicator'
import {
  getIndicatorRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { IndicatorMutations } from './root'

type TDeleteIndicatorInput = {
  uid: string
}

export const DeleteIndicatorInput = builder
  .inputRef<TDeleteIndicatorInput>('DeleteIndicatorInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

builder.objectField(IndicatorMutations, 'delete', (t) =>
  t.field({
    type: 'Boolean',
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: DeleteIndicatorInput,
        required: true,
      }),
    },
    resolve: withAuditedMutation(
      {
        action: 'delete',
        resourceType: 'indicator',
        getRequestPayload: ({ input }) => input,
        getInitialResourceUid: ({ input }) => input.uid,
        loadBefore: async ({ input }, { db }) =>
          getIndicatorRepository(db).findByUid(input.uid),
        getAfterSnapshot: async ({ input }, _result, { db }) =>
          getIndicatorRepository(db).findByUid(input.uid),
      },
      async (_, { input }, { db, user }) => {
        const indicatorRepo = getIndicatorRepository(db)
        const userRepo = getUserRepository(db)

        const useCase = new DeleteIndicator({
          indicatorRepository: indicatorRepo,
          userRepository: userRepo,
        })

        await useCase.execute({ uid: input.uid }, user.uid)

        return true
      },
    ),
  }),
)
