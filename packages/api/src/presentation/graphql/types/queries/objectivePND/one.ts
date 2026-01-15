import { GetObjectivePNDById } from '~/application/use-cases/objective-pnd'
import { getObjectivePNDRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ObjectivePND, type TObjectivePND } from '../../objects/ObjectivePND'
import { ObjectivePNDQueries } from './root'

builder.objectField(ObjectivePNDQueries, 'one', (t) =>
  t.field({
    type: ObjectivePND,
    authScopes: { protected: true },
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { db }): Promise<TObjectivePND> => {
      const objectivePNDRepository = getObjectivePNDRepository(db)

      const getObjective = new GetObjectivePNDById({
        objectivePNDRepository,
      })

      const objective = await getObjective.execute(args.uid)

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
