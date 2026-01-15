import { DeleteAlignmentPNDToODS } from '~/application/use-cases/alignment'
import {
  getAlignmentPNDToODSRepository,
  getObjectiveODSRepository,
  getObjectivePNDRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AlignmentMutations } from './root'

type TDeleteAlignmentPNDToODSInput = {
  pndObjectiveUid: string
  odsObjectiveUid: string
}

export const DeleteAlignmentPNDToODSInput = builder
  .inputRef<TDeleteAlignmentPNDToODSInput>('DeleteAlignmentPNDToODSInput')
  .implement({
    fields: (t) => ({
      pndObjectiveUid: t.string({ required: true }),
      odsObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(AlignmentMutations, 'deletePNDToODS', (t) =>
  t.field({
    type: 'Boolean', // Return true on success
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: DeleteAlignmentPNDToODSInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, { db }) => {
      const alignmentRepo = getAlignmentPNDToODSRepository(db)
      const pndRepo = getObjectivePNDRepository(db)
      const odsRepo = getObjectiveODSRepository(db)

      const useCase = new DeleteAlignmentPNDToODS({
        alignmentRepository: alignmentRepo,
        pndObjectiveRepository: pndRepo,
        odsObjectiveRepository: odsRepo,
      })

      await useCase.execute({
        pndObjectiveUid: input.pndObjectiveUid,
        odsObjectiveUid: input.odsObjectiveUid,
      })

      return true
    },
  }),
)
