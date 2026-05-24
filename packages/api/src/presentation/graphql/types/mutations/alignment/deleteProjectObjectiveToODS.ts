import { DeleteAlignmentProjectObjectiveToODS } from '~/application/use-cases/alignment'
import {
  getAlignmentProjectObjectiveToODSRepository,
  getObjectiveODSRepository,
  getProjectObjectiveRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import { withAuditedMutation } from '../../../helpers/audit'
import builder from '../../../schema/builder'
import { AlignmentMutations } from './root'

type TDeleteAlignmentProjectObjectiveToODSInput = {
  projectObjectiveUid: string
  odsObjectiveUid: string
}

export const DeleteAlignmentProjectObjectiveToODSInput = builder
  .inputRef<TDeleteAlignmentProjectObjectiveToODSInput>(
    'DeleteAlignmentProjectObjectiveToODSInput',
  )
  .implement({
    fields: (t) => ({
      projectObjectiveUid: t.string({ required: true }),
      odsObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(AlignmentMutations, 'deleteProjectObjectiveToODS', (t) =>
  t.field({
    type: 'Boolean',
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: DeleteAlignmentProjectObjectiveToODSInput,
        required: true,
      }),
    },
    resolve: withAuditedMutation(
      {
        action: 'delete',
        resourceType: 'alignment_project_objective_ods',
        getRequestPayload: ({ input }) => input,
        getInitialResourceUid: ({ input }) =>
          `${input.projectObjectiveUid}:${input.odsObjectiveUid}`,
        loadBefore: async ({ input }, { db }) => {
          const alignmentRepo = getAlignmentProjectObjectiveToODSRepository(db)
          const projectObjectiveRepo = getProjectObjectiveRepository(db)
          const odsRepo = getObjectiveODSRepository(db)
          const [projectObjective, odsObjective] = await Promise.all([
            projectObjectiveRepo.findByUidOrThrow(input.projectObjectiveUid),
            odsRepo.findByUidOrThrow(input.odsObjectiveUid),
          ])

          return alignmentRepo.findMany({
            projectObjectiveId: projectObjective.id,
            odsObjectiveId: odsObjective.id,
          })
        },
        getAfterSnapshot: async ({ input }, _result, { db }) => {
          const alignmentRepo = getAlignmentProjectObjectiveToODSRepository(db)
          const projectObjectiveRepo = getProjectObjectiveRepository(db)
          const odsRepo = getObjectiveODSRepository(db)
          const [projectObjective, odsObjective] = await Promise.all([
            projectObjectiveRepo.findByUidOrThrow(input.projectObjectiveUid),
            odsRepo.findByUidOrThrow(input.odsObjectiveUid),
          ])

          return alignmentRepo.findMany({
            projectObjectiveId: projectObjective.id,
            odsObjectiveId: odsObjective.id,
          })
        },
      },
      async (_, { input }, { db }) => {
        const alignmentRepo = getAlignmentProjectObjectiveToODSRepository(db)
        const projectObjectiveRepo = getProjectObjectiveRepository(db)
        const odsRepo = getObjectiveODSRepository(db)

        const useCase = new DeleteAlignmentProjectObjectiveToODS({
          alignmentRepository: alignmentRepo,
          projectObjectiveRepository: projectObjectiveRepo,
          odsObjectiveRepository: odsRepo,
        })

        await useCase.execute({
          projectObjectiveUid: input.projectObjectiveUid,
          odsObjectiveUid: input.odsObjectiveUid,
        })

        return true
      },
    ),
  }),
)
