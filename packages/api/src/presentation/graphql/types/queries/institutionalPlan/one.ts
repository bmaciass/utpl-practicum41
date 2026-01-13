import { GetInstitutionalPlanById } from '~/application/use-cases/institutional-plan'
import { getInstitutionalPlanRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionalPlan } from '../../objects/InstitutionalPlan'
import { InstitutionalPlanQueries } from './root'

builder.objectField(InstitutionalPlanQueries, 'one', (t) =>
  t.field({
    type: InstitutionalPlan,
    nullable: true,
    authScopes: { protected: true },
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, { id }, { db }) => {
      const institutionalPlanRepository = getInstitutionalPlanRepository(db)
      const getPlanById = new GetInstitutionalPlanById({
        institutionalPlanRepository,
      })

      const plan = await getPlanById.execute(id)
      if (!plan) return null

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
