import { ListObjectivePND } from '~/application/use-cases/objective-pnd'
import { getObjectivePNDRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import { ObjectivePND, type TObjectivePND } from '../../objects/ObjectivePND'
import { ObjectivePNDQueries } from './root'

export type TObjectivePNDQueryResponse = {
  records: TObjectivePND[]
}

export const ObjectivePNDQueryResponse = builder
  .objectRef<TObjectivePNDQueryResponse>('ObjectivePNDQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [ObjectivePND] }),
    }),
  })

builder.objectField(ObjectivePNDQueries, 'list', (t) =>
  t.field({
    type: ObjectivePNDQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
    },
    resolve: async (_, args, { db }) => {
      const objectivePNDRepository = getObjectivePNDRepository(db)

      const listObjectives = new ListObjectivePND({
        objectivePNDRepository,
      })

      const objectives = await listObjectives.execute({
        where: {
          active: args.active ?? undefined,
          name: typeof args.name === 'string' ? args.name : undefined,
        },
      })

      return {
        records: objectives.map((objective) => ({
          id: objective.id,
          uid: objective.uid,
          name: objective.name,
          description: objective.description,
          active: objective.active,
          deletedAt: objective.deletedAt,
        })),
      }
    },
  }),
)
