import { UpdateObjectivePND } from '~/application/use-cases/objective-pnd'
import {
  getObjectivePNDRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ObjectivePND } from '../../objects/ObjectivePND'
import { ObjectivePNDMutations } from './root'

type TUpdateObjectivePNDWhereInput = {
  uid: string
}

export const UpdateObjectivePNDWhereInput = builder
  .inputRef<TUpdateObjectivePNDWhereInput>('UpdateObjectivePNDWhereInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateObjectivePNDDataInput = {
  name?: string
  description?: string
  active?: boolean
}

export const UpdateObjectivePNDDataInput = builder
  .inputRef<TUpdateObjectivePNDDataInput>('UpdateObjectivePNDDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      active: t.boolean({ required: false }),
    }),
  })

builder.objectField(ObjectivePNDMutations, 'update', (t) =>
  t.field({
    type: ObjectivePND,
    authScopes: { protected: true },
    args: {
      where: t.arg({
        type: UpdateObjectivePNDWhereInput,
        required: true,
      }),
      data: t.arg({
        type: UpdateObjectivePNDDataInput,
        required: true,
      }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const objectivePNDRepository = getObjectivePNDRepository(db)
      const userRepository = getUserRepository(db)

      const updateObjective = new UpdateObjectivePND({
        objectivePNDRepository,
        userRepository,
      })

      const objective = await updateObjective.execute(
        {
          uid: where.uid,
          data: {
            name: data.name ?? undefined,
            description: data.description ?? undefined,
            active: data.active ?? undefined,
          },
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
