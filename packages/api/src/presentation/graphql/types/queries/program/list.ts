import { ListPrograms } from '~/application/use-cases/program'
import {
  getInstitutionRepository,
  getProgramRepository,
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
      institutionUid: t.arg.string({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
    },
    resolve: async (_, args, { db }) => {
      const institutionRepository = getInstitutionRepository(db)
      const programRepository = getProgramRepository(db)
      const listPrograms = new ListPrograms({
        institutionRepository,
        programRepository,
      })

      const records = await listPrograms.execute({
        institutionUid: args.institutionUid ?? undefined,
        where: {
          active: args.active ?? undefined,
          name: args.name
            ? { contains: args.name.contains ?? undefined }
            : undefined,
        },
      })

      return { records }
    },
  }),
)
