import type { ProgramPayload } from '@sigep/db'
import { CreateProgram } from '~/application/use-cases/program'
import {
  getProgramRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Program } from '../../objects/Program'
import { ProgramMutations } from './root'

type TCreateProgramDataInput = Pick<
  ProgramPayload,
  'name' | 'description' | 'startDate' | 'endDate'
> & {
  responsibleId: string
}

export const CreateProgramDataInput = builder
  .inputRef<TCreateProgramDataInput>('CreateProgramDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      description: t.string(),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
      responsibleId: t.string(),
    }),
  })

builder.objectField(ProgramMutations, 'create', (t) =>
  t.field({
    type: Program,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateProgramDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const programRepository = getProgramRepository(db)
      const userRepository = getUserRepository(db)
      const createProgram = new CreateProgram({
        programRepository,
        userRepository,
      })

      const program = await createProgram.execute(
        {
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          responsibleUid: data.responsibleId,
        },
        user.uid,
      )

      return {
        id: program.id,
        uid: program.uid,
        name: program.name,
        description: program.description,
        startDate: program.startDate,
        endDate: program.endDate,
        active: program.active,
        deletedAt: program.deletedAt,
        responsibleId: program.responsibleId,
      }
    },
  }),
)
