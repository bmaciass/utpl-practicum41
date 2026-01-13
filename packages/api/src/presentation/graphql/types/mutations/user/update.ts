import { UpdateUser } from '~/application/use-cases/user'
import { DrizzleUnitOfWork } from '~/infrastructure/persistence/drizzle/DrizzleUnitOfWork'
import { PasswordService } from '~/infrastructure/services/PasswordService'
import builder from '../../../schema/builder'
import { User } from '../../objects/User'
import { UserMutations } from './root'

interface UpdateUserWhereInputType {
  id: string
}

interface UpdateUserDataInputType {
  name?: string | null
  password?: string | null
  active?: boolean | null
  firstName?: string | null
  lastName?: string | null
  dni?: string | null
}

export const UpdateUserWhereInput = builder
  .inputRef<UpdateUserWhereInputType>('UpdateUserWhereInput')
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  })

export const UpdateUserDataInput = builder
  .inputRef<UpdateUserDataInputType>('UpdateUserDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      password: t.string({ required: false }),
      active: t.boolean({ required: false }),
      firstName: t.string({ required: false }),
      lastName: t.string({ required: false }),
      dni: t.string({ required: false }),
    }),
  })

builder.objectField(UserMutations, 'update', (t) =>
  t.field({
    type: User,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateUserWhereInput, required: true }),
      data: t.arg({ type: UpdateUserDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user: currentUser }) => {
      const unitOfWork = new DrizzleUnitOfWork(db)
      const useCase = new UpdateUser({
        unitOfWork,
        passwordService: new PasswordService(),
      })

      const user = await useCase.execute(
        {
          uid: where.id,
          name: data.name ?? undefined,
          password: data.password ?? undefined,
          active: data.active ?? undefined,
          firstName: data.firstName ?? undefined,
          lastName: data.lastName ?? undefined,
          dni: data.dni ?? undefined,
        },
        currentUser.uid,
      )

      return user
    },
  }),
)
