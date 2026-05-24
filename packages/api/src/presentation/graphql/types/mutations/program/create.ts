import type { ProgramPayload } from '@sigep/db'
import { CreateProgram } from '~/application/use-cases/program'
import {
  getInstitutionRepository,
  getProgramRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { Program } from '../../objects/Program'
import { ProgramMutations } from './root'

type TCreateProgramDataInput = Pick<
  ProgramPayload,
  'name' | 'description' | 'startDate' | 'endDate' | 'estimatedInversion'
> & {
  institutionUid: string
  responsibleUid: string
}

export const CreateProgramDataInput = builder
  .inputRef<TCreateProgramDataInput>('CreateProgramDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      description: t.string(),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
      estimatedInversion: t.field({ type: 'Decimal', required: false }),
      institutionUid: t.string(),
      responsibleUid: t.string(),
    }),
  })

builder.objectField(ProgramMutations, 'create', (t) =>
  t.field({
    type: Program,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateProgramDataInput, required: true }),
    },
    resolve: withAuditedMutation(
      {
        action: 'create',
        resourceType: 'program',
        getRequestPayload: ({ data }) => data,
        getResourceUid: (_args, result) => result.uid,
      },
      async (_, { data }, { db, user }) => {
        const institutionRepository = getInstitutionRepository(db)
        const programRepository = getProgramRepository(db)
        const userRepository = getUserRepository(db)
        const createProgram = new CreateProgram({
          institutionRepository,
          programRepository,
          userRepository,
        })

        const program = await createProgram.execute(
          {
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            estimatedInversion: data.estimatedInversion,
            institutionUid: data.institutionUid,
            responsibleUid: data.responsibleUid,
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
          estimatedInversion: program.estimatedInversion,
          active: program.active,
          deletedAt: program.deletedAt,
          institutionId: program.institutionId,
          responsibleId: program.responsibleId,
        }
      },
    ),
  }),
)
