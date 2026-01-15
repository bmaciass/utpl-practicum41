import { CreateObjectivePND } from '~/application/use-cases/objective-pnd'
import {
  getObjectivePNDRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ObjectivePND } from '../../objects/ObjectivePND'
import { ObjectivePNDMutations } from './root'

type TCreateObjectivePNDDataInput = {
  name: string
  description: string
}

export const CreateObjectivePNDDataInput = builder
  .inputRef<TCreateObjectivePNDDataInput>('CreateObjectivePNDDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.string({ required: true }),
    }),
  })

builder.objectField(ObjectivePNDMutations, 'create', (t) =>
  t.field({
    type: ObjectivePND,
    authScopes: { protected: true },
    args: {
      data: t.arg({
        type: CreateObjectivePNDDataInput,
        required: true,
      }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const objectivePNDRepository = getObjectivePNDRepository(db)
      const userRepository = getUserRepository(db)

      const createObjective = new CreateObjectivePND({
        objectivePNDRepository,
        userRepository,
      })

      const objective = await createObjective.execute(
        {
          name: data.name,
          description: data.description,
        },
        user.uid,
      )

      return {
        id: objective.id,
        uid: objective.uid,
        name: objective.name,
        description: objective.description,
        active: objective.active,
        deletedAt: objective.deletedAt,
      }
    },
  }),
)
