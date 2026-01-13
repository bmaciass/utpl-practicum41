import { ListUsers } from '~/application/use-cases/user'
import { getUserRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import { type TUser, User } from '../../objects/User'
import { UserQueries } from './root'

export type TUsersQueryResponse = {
  records: TUser[]
}

export const UsersQueryResponse = builder
  .objectRef<TUsersQueryResponse>('UsersQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [User] }),
    }),
  })

builder.objectField(UserQueries, 'list', (t) =>
  t.field({
    type: UsersQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
    },
    resolve: async (_, { active, name }, { db }) => {
      const userRepository = getUserRepository(db)
      const useCase = new ListUsers({ userRepository })

      const users = await useCase.execute({
        where: {
          active: active ?? undefined,
          name: name?.contains ?? undefined,
        },
      })

      return { records: users }
    },
  }),
)
