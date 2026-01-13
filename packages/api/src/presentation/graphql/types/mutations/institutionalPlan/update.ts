import { UpdateInstitutionalPlan } from '~/application/use-cases/institutional-plan'
import { getInstitutionalPlanRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionalPlan } from '../../objects/InstitutionalPlan'
import { InstitutionalPlanMutations } from './root'

type TUpdateInstitutionalPlanWhereInput = {
  id: string
}

export const UpdateInstitutionalPlanWhereInput = builder
  .inputRef<TUpdateInstitutionalPlanWhereInput>(
    'UpdateInstitutionalPlanWhereInput',
  )
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  })

type TUpdateInstitutionalPlanDataInput = {
  name?: string
  active?: boolean
  year?: number
}

export const UpdateInstitutionalPlanDataInput = builder
  .inputRef<TUpdateInstitutionalPlanDataInput>(
    'UpdateInstitutionalPlanDataInput',
  )
  .implement({
    fields: (t) => ({
      name: t.string(),
      active: t.boolean(),
      year: t.int(),
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
      const updatePlan = new UpdateInstitutionalPlan({
        institutionalPlanRepository,
      })

      const plan = await updatePlan.execute(
        {
          uid: where.id,
          data: {
            name: data.name ?? undefined,
            active: data.active ?? undefined,
            year: data.year ?? undefined,
          },
        },
        user.uid,
      )

      return {
        uid: plan.uid,
        name: plan.name,
        active: plan.active,
        url: plan.url,
        version: plan.version,
        year: plan.year,
        deletedAt: plan.deletedAt,
        institutionId: plan.institutionId,
      }
    },
  }),
)
