import { CreateAlignmentProjectObjectiveToODS } from '~/application/use-cases/alignment'
import {
  getAlignmentProjectObjectiveToODSRepository,
  getObjectiveODSRepository,
  getProjectObjectiveRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AlignmentProjectObjectiveToODS } from '../../objects/AlignmentProjectObjectiveToODS'
import { AlignmentMutations } from './root'

type TCreateAlignmentProjectObjectiveToODSInput = {
  projectObjectiveUid: string
  odsObjectiveUid: string
}

export const CreateAlignmentProjectObjectiveToODSInput = builder
  .inputRef<TCreateAlignmentProjectObjectiveToODSInput>(
    'CreateAlignmentProjectObjectiveToODSInput',
  )
  .implement({
    fields: (t) => ({
      projectObjectiveUid: t.string({ required: true }),
      odsObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(AlignmentMutations, 'createProjectObjectiveToODS', (t) =>
  t.field({
    type: AlignmentProjectObjectiveToODS,
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: CreateAlignmentProjectObjectiveToODSInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, { db, user }) => {
      const alignmentRepo = getAlignmentProjectObjectiveToODSRepository(db)
      const projectObjectiveRepo = getProjectObjectiveRepository(db)
      const odsRepo = getObjectiveODSRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new CreateAlignmentProjectObjectiveToODS({
        alignmentRepository: alignmentRepo,
        projectObjectiveRepository: projectObjectiveRepo,
        odsObjectiveRepository: odsRepo,
        userRepository: userRepo,
      })

      const result = await useCase.execute(
        {
          projectObjectiveUid: input.projectObjectiveUid,
          odsObjectiveUid: input.odsObjectiveUid,
        },
        user.uid,
      )

      return {
        id: result.id,
        projectObjectiveId: result.projectObjective.id,
        odsObjectiveId: result.odsObjective.id,
        projectObjectiveUid: result.projectObjective.uid,
        odsObjectiveUid: result.odsObjective.uid,
        createdAt: result.createdAt,
      }
    },
  }),
)
