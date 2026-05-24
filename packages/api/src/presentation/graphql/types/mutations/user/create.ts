import { CreateUserWithPerson } from '~/application/use-cases/user'
import { DrizzleUnitOfWork } from '~/infrastructure/persistence/drizzle/DrizzleUnitOfWork'
import { PasswordService } from '~/infrastructure/services/PasswordService'
import { executeAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { User } from '../../objects/User'
import { UserMutations } from './root'

interface CreateUserDataInputType {
  name: string
  password: string
  dni: string
  firstName: string
  lastName: string
}

export const CreateUserDataInput = builder
  .inputRef<CreateUserDataInputType>('CreateUserDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      dni: t.string(),
      firstName: t.string(),
      lastName: t.string(),
      password: t.string(),
    }),
  })

builder.objectField(UserMutations, 'create', (t) =>
  t.field({
    type: User,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateUserDataInput, required: true }),
    },
    resolve: async (_, { data }, context, info) => {
      const { db, user: currentUser } = context
      const unitOfWork = new DrizzleUnitOfWork(db)
      const useCase = new CreateUserWithPerson({
        unitOfWork,
        passwordService: new PasswordService(),
      })

      return executeAuditedMutation({
        context,
        info,
        action: 'create',
        resourceType: 'user',
        requestPayload: data,
        afterSnapshot: (result) => result,
        getResourceUid: (result) => result.uid,
        run: async () => {
          const result = await useCase.execute(
            {
              name: data.name,
              password: data.password,
              firstName: data.firstName,
              lastName: data.lastName,
              dni: data.dni,
            },
            currentUser.uid,
          )

          return {
            uid: result.uid,
            name: result.name,
            active: result.active,
            deletedAt: result.deletedAt,
            personId: result.personId,
          }
        },
      })
    },
  }),
)
