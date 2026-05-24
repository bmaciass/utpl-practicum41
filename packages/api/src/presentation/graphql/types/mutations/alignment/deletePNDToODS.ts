import { DeleteAlignmentPNDToODS } from '~/application/use-cases/alignment'
import {
  getAlignmentPNDToODSRepository,
  getObjectiveODSRepository,
  getObjectivePNDRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
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
    resolve: withAuditedMutation(
      {
        action: 'delete',
        resourceType: 'alignment_pnd_ods',
        getRequestPayload: ({ input }) => input,
        getInitialResourceUid: ({ input }) =>
          `${input.pndObjectiveUid}:${input.odsObjectiveUid}`,
        loadBefore: async ({ input }, { db }) => {
          const alignmentRepo = getAlignmentPNDToODSRepository(db)
          const pndRepo = getObjectivePNDRepository(db)
          const odsRepo = getObjectiveODSRepository(db)
          const [pndObjective, odsObjective] = await Promise.all([
            pndRepo.findByUidOrThrow(input.pndObjectiveUid),
            odsRepo.findByUidOrThrow(input.odsObjectiveUid),
          ])

          return alignmentRepo.findMany({
            pndObjectiveId: pndObjective.id,
            odsObjectiveId: odsObjective.id,
          })
        },
        getAfterSnapshot: async ({ input }, _result, { db }) => {
          const alignmentRepo = getAlignmentPNDToODSRepository(db)
          const pndRepo = getObjectivePNDRepository(db)
          const odsRepo = getObjectiveODSRepository(db)
          const [pndObjective, odsObjective] = await Promise.all([
            pndRepo.findByUidOrThrow(input.pndObjectiveUid),
            odsRepo.findByUidOrThrow(input.odsObjectiveUid),
          ])

          return alignmentRepo.findMany({
            pndObjectiveId: pndObjective.id,
            odsObjectiveId: odsObjective.id,
          })
        },
      },
      async (_, { input }, { db }) => {
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
    ),
  }),
)
