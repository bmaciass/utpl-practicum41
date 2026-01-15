import { CreateAlignmentInstitutionalToPND } from '~/application/use-cases/alignment'
import {
  getAlignmentInstitutionalToPNDRepository,
  getInstitutionalObjectiveRepository,
  getObjectivePNDRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AlignmentInstitutionalToPND } from '../../objects/AlignmentInstitutionalToPND'
import { AlignmentMutations } from './root'

type TCreateAlignmentInstitutionalToPNDInput = {
  institutionalObjectiveUid: string
  pndObjectiveUid: string
}

export const CreateAlignmentInstitutionalToPNDInput = builder
  .inputRef<TCreateAlignmentInstitutionalToPNDInput>(
    'CreateAlignmentInstitutionalToPNDInput',
  )
  .implement({
    fields: (t) => ({
      institutionalObjectiveUid: t.string({ required: true }),
      pndObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(AlignmentMutations, 'createInstitutionalToPND', (t) =>
  t.field({
    type: AlignmentInstitutionalToPND,
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: CreateAlignmentInstitutionalToPNDInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, { db, user }) => {
      const alignmentRepo = getAlignmentInstitutionalToPNDRepository(db)
      const institutionalRepo = getInstitutionalObjectiveRepository(db)
      const pndRepo = getObjectivePNDRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new CreateAlignmentInstitutionalToPND({
        alignmentRepository: alignmentRepo,
        institutionalObjectiveRepository: institutionalRepo,
        pndObjectiveRepository: pndRepo,
        userRepository: userRepo,
      })

      const result = await useCase.execute(
        {
          institutionalObjectiveUid: input.institutionalObjectiveUid,
          pndObjectiveUid: input.pndObjectiveUid,
        },
        user.uid,
      )

      // Map to GraphQL type
      return {
        id: result.id,
        institutionalObjectiveId: result.institutionalObjective.id,
        institutionalObjectiveUid: result.institutionalObjective.uid,
        pndObjectiveId: result.pndObjective.id,
        pndObjectiveUid: result.pndObjective.uid,
        createdAt: result.createdAt,
      }
    },
  }),
)
