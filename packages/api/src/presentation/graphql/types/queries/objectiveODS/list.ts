import { ListObjectiveODS } from '~/application/use-cases/objectiveODS'
import { getObjectiveODSRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import { ObjectiveODS, type TObjectiveODS } from '../../objects/ObjectiveODS'
import { ObjectiveODSQueries } from './root'

export type TObjectiveODSQueryResponse = {
  records: TObjectiveODS[]
}

export const ObjectiveODSQueryResponse = builder
  .objectRef<TObjectiveODSQueryResponse>('ObjectiveODSQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [ObjectiveODS] }),
    }),
  })

builder.objectField(ObjectiveODSQueries, 'list', (t) =>
  t.field({
    type: ObjectiveODSQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
    },
    resolve: async (_, { active, name }, { db }) => {
      const objectiveODSRepository = getObjectiveODSRepository(db)

      const listObjectiveODS = new ListObjectiveODS({
        objectiveODSRepository,
      })

      const records = await listObjectiveODS.execute({
        where: {
          active: active ?? undefined,
          name: name ?? undefined,
        },
      })

      return { records }
    },
  }),
)
