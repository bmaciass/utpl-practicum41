import { UpdateInstitutionalPlan } from '~/application/use-cases/institutional-plan'
import {
  getInstitutionalPlanRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionalPlan } from '../../objects/InstitutionalPlan'
import { InstitutionalPlanMutations } from './root'

type TUpdateInstitutionalPlanWhereInput = {
  uid: string
}

export const UpdateInstitutionalPlanWhereInput = builder
  .inputRef<TUpdateInstitutionalPlanWhereInput>(
    'UpdateInstitutionalPlanWhereInput',
  )
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateInstitutionalPlanDataInput = {
  name?: string
  description?: string
  active?: boolean
  url?: string | null
  year?: number
}

export const UpdateInstitutionalPlanDataInput = builder
  .inputRef<TUpdateInstitutionalPlanDataInput>(
    'UpdateInstitutionalPlanDataInput',
  )
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      active: t.boolean({ required: false }),
      url: t.string({ required: false }),
      year: t.int({ required: false }),
    }),
  })

builder.objectField(InstitutionalPlanMutations, 'update', (t) =>
  t.field({
    type: InstitutionalPlan,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateInstitutionalPlanWhereInput, required: true }),
      data: t.arg({ type: UpdateInstitutionalPlanDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const institutionalPlanRepository = getInstitutionalPlanRepository(db)
      const userRepository = getUserRepository(db)
      const updatePlan = new UpdateInstitutionalPlan({
        institutionalPlanRepository,
        userRepository,
      })

      const plan = await updatePlan.execute(
        {
          uid: where.uid,
          data: {
            name: data.name ?? undefined,
            active: data.active ?? undefined,
            year: data.year ?? undefined,
            description: data.description ?? undefined,
            url: data.url,
          },
        },
        user.uid,
      )

      return {
        uid: plan.uid,
        name: plan.name,
        active: plan.active,
        url: plan.url,
        year: plan.year,
        description: plan.description,
        deletedAt: plan.deletedAt,
        institutionId: plan.institutionId,
      }
    },
  }),
)
