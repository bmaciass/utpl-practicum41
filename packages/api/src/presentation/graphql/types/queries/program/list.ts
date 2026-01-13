import { ListPrograms } from '~/application/use-cases/program'
import {
  getProgramRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import { Program, type TProgram } from '../../objects/Program'
import { ProgramQueries } from './root'

export type TProgramsQueryResponse = {
  records: TProgram[]
}

export const ProgramsQueryResponse = builder
  .objectRef<TProgramsQueryResponse>('ProgramsQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [Program] }),
    }),
  })

builder.objectField(ProgramQueries, 'list', (t) =>
  t.field({
    type: ProgramsQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
    },
    resolve: async (_, __, { db }) => {
      const programRepository = getProgramRepository(db)
      const userRepository = getUserRepository(db)
      const listPrograms = new ListPrograms({
        programRepository,
        userRepository,
      })

      // TODO: Add filters
      const records = await listPrograms.execute({})

      return { records }
    },
  }),
)
