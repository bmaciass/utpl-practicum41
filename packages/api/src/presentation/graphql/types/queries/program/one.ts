import { GetProgramById } from '~/application/use-cases/program'
import {
  getProgramRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Program, type TProgram } from '../../objects/Program'
import { ProgramQueries } from './root'

builder.objectField(ProgramQueries, 'one', (t) =>
  t.field({
    type: Program,
    nullable: true,
    authScopes: { protected: true },
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, { id }, { db }) => {
      const programRepository = getProgramRepository(db)
      const userRepository = getUserRepository(db)
      const getProgramById = new GetProgramById({
        programRepository,
        userRepository,
      })

      const program = await getProgramById.execute(id)
      if (!program) return null

      return {
        id: program.id,
        uid: program.uid,
        name: program.name,
        description: program.description,
        startDate: program.startDate,
        endDate: program.endDate,
        estimatedInversion: program.estimatedInversion,
        active: program.active,
        responsibleId: program.responsibleId,
        deletedAt: program.deletedAt,
      } satisfies TProgram
    },
  }),
)
