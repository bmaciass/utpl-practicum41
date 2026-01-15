import { CreateAlignmentPNDToODS } from '~/application/use-cases/alignment'
import {
  getAlignmentPNDToODSRepository,
  getObjectiveODSRepository,
  getObjectivePNDRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { AlignmentPNDToODS } from '../../objects/AlignmentPNDToODS'
import { AlignmentMutations } from './root'

type TCreateAlignmentPNDToODSInput = {
  pndObjectiveUid: string
  odsObjectiveUid: string
}

export const CreateAlignmentPNDToODSInput = builder
  .inputRef<TCreateAlignmentPNDToODSInput>('CreateAlignmentPNDToODSInput')
  .implement({
    fields: (t) => ({
      pndObjectiveUid: t.string({ required: true }),
      odsObjectiveUid: t.string({ required: true }),
    }),
  })

builder.objectField(AlignmentMutations, 'createPNDToODS', (t) =>
  t.field({
    type: AlignmentPNDToODS,
    authScopes: { protected: true },
    args: {
      input: t.arg({
        type: CreateAlignmentPNDToODSInput,
        required: true,
      }),
    },
    resolve: async (_, { input }, { db, user }) => {
      const alignmentRepo = getAlignmentPNDToODSRepository(db)
      const pndRepo = getObjectivePNDRepository(db)
      const odsRepo = getObjectiveODSRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new CreateAlignmentPNDToODS({
        alignmentRepository: alignmentRepo,
        pndObjectiveRepository: pndRepo,
        odsObjectiveRepository: odsRepo,
        userRepository: userRepo,
      })

      const result = await useCase.execute(
        {
          pndObjectiveUid: input.pndObjectiveUid,
          odsObjectiveUid: input.odsObjectiveUid,
        },
        user.uid,
      )

      // Map to GraphQL type
      return {
        id: result.id,
        pndObjectiveId: result.pndObjective.id,
        odsObjectiveId: result.odsObjective.id,
        pndObjectiveUid: result.pndObjective.uid,
        odsObjectiveUid: result.odsObjective.uid,
        createdAt: result.createdAt,
      }
    },
  }),
)
