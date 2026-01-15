import { DeleteAlignmentInstitutionalToPND } from '~/application/use-cases/alignment'
import {
  getAlignmentInstitutionalToPNDRepository,
  getInstitutionalObjectiveRepository,
  getObjectivePNDRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AlignmentMutations } from './root'

type TDeleteAlignmentInstitutionalToPNDInput = {
  institutionalObjectiveUid: string
  pndObjectiveUid: string
}

export const DeleteAlignmentInstitutionalToPNDInput = builder
  .inputRef<TDeleteAlignmentInstitutionalToPNDInput>(
    'DeleteAlignmentInstitutionalToPNDInput',
  )
  .implement({
    fields: (t) => ({
      institutionalObjectiveUid: t.string({ required: true }),
      pndObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(AlignmentMutations, 'deleteInstitutionalToPND', (t) =>
  t.field({
    type: 'Boolean', // Return true on success
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: DeleteAlignmentInstitutionalToPNDInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, { db }) => {
      const alignmentRepo = getAlignmentInstitutionalToPNDRepository(db)
      const institutionalRepo = getInstitutionalObjectiveRepository(db)
      const pndRepo = getObjectivePNDRepository(db)

      const useCase = new DeleteAlignmentInstitutionalToPND({
        alignmentRepository: alignmentRepo,
        institutionalObjectiveRepository: institutionalRepo,
        pndObjectiveRepository: pndRepo,
      })

      await useCase.execute({
        institutionalObjectiveUid: input.institutionalObjectiveUid,
        pndObjectiveUid: input.pndObjectiveUid,
      })

      return true
    },
  }),
)
