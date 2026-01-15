import { ListInstitutionalPlans } from '~/application/use-cases/institutional-plan'
import {
  getInstitutionRepository,
  getInstitutionalPlanRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { StringFilter } from '../../inputs/FilterInputs'
import {
  InstitutionalPlan,
  type TInstitutionalPlan,
} from '../../objects/InstitutionalPlan'
import { InstitutionalPlanQueries } from './root'

export type TInstitutionalPlansQueryResponse = {
  records: TInstitutionalPlan[]
}

export const InstitutionalPlansQueryResponse = builder
  .objectRef<TInstitutionalPlansQueryResponse>(
    'InstitutionalPlansQueryResponse',
  )
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [InstitutionalPlan] }),
    }),
  })

builder.objectField(InstitutionalPlanQueries, 'list', (t) =>
  t.field({
    type: InstitutionalPlansQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      name: t.arg({ type: StringFilter, required: false }),
      institutionUid: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { db }) => {
      const institutionRepository = getInstitutionRepository(db)
      const institutionalPlanRepository = getInstitutionalPlanRepository(db)
      const listPlans = new ListInstitutionalPlans({
        institutionRepository,
        institutionalPlanRepository,
      })

      const plans = await listPlans.execute({
        institutionUid: args.institutionUid,
        filters: {
          active: args.active ?? undefined,
        },
      })

      return {
        records: plans.map((plan) => ({
          uid: plan.uid,
          name: plan.name,
          active: plan.active,
          url: plan.url,
          year: plan.year,
          deletedAt: plan.deletedAt,
          institutionId: plan.institutionId,
        })),
      }
    },
  }),
)
