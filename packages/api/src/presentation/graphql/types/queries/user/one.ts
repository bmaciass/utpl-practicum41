import { GetUserById } from '~/application/use-cases/user'
import { getUserRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { User } from '../../objects/User'
import { UserQueries } from './root'

builder.objectField(UserQueries, 'one', (t) =>
  t.field({
    type: User,
    nullable: true,
    authScopes: { protected: true },
    args: {
      id: t.arg.string(),
    },
    resolve: async (_, { id }, { db }) => {
      if (!id) return null

      const userRepository = getUserRepository(db)
      const useCase = new GetUserById({ userRepository })
      const user = await useCase.execute(id)

      if (!user) return null

      return user
    },
  }),
)
