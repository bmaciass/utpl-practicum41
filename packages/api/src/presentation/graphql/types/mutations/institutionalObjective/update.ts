import { UpdateInstitutionalObjective } from '~/application/use-cases/institutional-objective'
import {
  getInstitutionRepository,
  getInstitutionalObjectiveRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionalObjective } from '../../objects/InstitutionalObjective'
import { InstitutionalObjectiveMutations } from './root'

type TUpdateInstitutionalObjectiveWhereInput = {
  uid: string
}

export const UpdateInstitutionalObjectiveWhereInput = builder
  .inputRef<TUpdateInstitutionalObjectiveWhereInput>(
    'UpdateInstitutionalObjectiveWhereInput',
  )
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateInstitutionalObjectiveDataInput = {
  name?: string
  description?: string
  institutionId?: string
  active?: boolean
}

export const UpdateInstitutionalObjectiveDataInput = builder
  .inputRef<TUpdateInstitutionalObjectiveDataInput>(
    'UpdateInstitutionalObjectiveDataInput',
  )
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      institutionId: t.string({ required: false }),
      active: t.boolean({ required: false }),
    }),
  })

builder.objectField(InstitutionalObjectiveMutations, 'update', (t) =>
  t.field({
    type: InstitutionalObjective,
    authScopes: { protected: true },
    args: {
      where: t.arg({
        type: UpdateInstitutionalObjectiveWhereInput,
        required: true,
      }),
      data: t.arg({
        type: UpdateInstitutionalObjectiveDataInput,
        required: true,
      }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const institutionalObjectiveRepository =
        getInstitutionalObjectiveRepository(db)
      const institutionRepository = getInstitutionRepository(db)
      const userRepository = getUserRepository(db)

      const updateObjective = new UpdateInstitutionalObjective({
        institutionalObjectiveRepository,
        institutionRepository,
        userRepository,
      })

      const objective = await updateObjective.execute(
        {
          uid: where.uid,
          data: {
            name: data.name ?? undefined,
            description: data.description ?? undefined,
            institutionUid: data.institutionId ?? undefined,
            active: data.active ?? undefined,
          },
        },
        user.uid,
      )

      return {
        id: objective.id,
        uid: objective.uid,
        name: objective.name,
        description: objective.description,
        active: objective.active,
        deletedAt: objective.deletedAt,
        institutionId: objective.institutionId,
      }
    },
  }),
)
