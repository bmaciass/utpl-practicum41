import type { ProgramPayload } from '@sigep/db'
import type { SetOptional } from 'type-fest'
import { UpdateProgram } from '~/application/use-cases/program'
import {
  getProgramRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Program } from '../../objects/Program'
import { ProgramMutations } from './root'

type TUpdateProgramWhereInput = {
  id: string
}

export const UpdateProgramWhereInput = builder
  .inputRef<TUpdateProgramWhereInput>('UpdateProgramWhereInput')
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  })

type TUpdateProgramDataInput = Pick<
  SetOptional<ProgramPayload, 'name' | 'description' | 'startDate' | 'endDate'>,
  'name' | 'description' | 'startDate' | 'endDate'
> & {
  active?: boolean
  responsibleId?: string
}

export const UpdateProgramDataInput = builder
  .inputRef<TUpdateProgramDataInput>('UpdateProgramDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      active: t.boolean({ required: false }),
      description: t.string({ required: false }),
      responsibleId: t.string({ required: false }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
    }),
  })

builder.objectField(ProgramMutations, 'update', (t) =>
  t.field({
    type: Program,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateProgramWhereInput, required: true }),
      data: t.arg({ type: UpdateProgramDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const programRepository = getProgramRepository(db)
      const userRepository = getUserRepository(db)
      const updateProgram = new UpdateProgram({
        programRepository,
        userRepository,
      })

      const program = await updateProgram.execute(
        {
          uid: where.id,
          data: {
            name: data.name ?? undefined,
            description: data.description ?? undefined,
            startDate: data.startDate ?? undefined,
            endDate: data.endDate ?? undefined,
            responsibleUid: data.responsibleId ?? undefined,
            active: data.active ?? undefined,
          },
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
