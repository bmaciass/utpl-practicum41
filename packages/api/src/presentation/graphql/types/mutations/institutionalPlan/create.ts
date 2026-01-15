import { CreateInstitutionalPlan } from '~/application/use-cases/institutional-plan'
import {
  getInstitutionRepository,
  getInstitutionalPlanRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionalPlan } from '../../objects/InstitutionalPlan'
import { InstitutionalPlanMutations } from './root'

type TCreateInstitutionalPlanDataInput = {
  name: string
  url: string
  year: number
  institutionId: string
}

export const CreateInstitutionalPlanDataInput = builder
  .inputRef<TCreateInstitutionalPlanDataInput>(
    'CreateInstitutionalPlanDataInput',
  )
  .implement({
    fields: (t) => ({
      name: t.string(),
      institutionId: t.string(),
      url: t.string(),
      year: t.int(),
    }),
  })

builder.objectField(InstitutionalPlanMutations, 'create', (t) =>
  t.field({
    type: InstitutionalPlan,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateInstitutionalPlanDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const institutionalPlanRepository = getInstitutionalPlanRepository(db)
      const institutionRepository = getInstitutionRepository(db)
      const userRepository = getUserRepository(db)

      const createPlan = new CreateInstitutionalPlan({
        institutionalPlanRepository,
        institutionRepository,
        userRepository,
      })

      const plan = await createPlan.execute(
        {
          name: data.name,
          url: data.url,
          year: data.year,
          institutionUid: data.institutionId,
        },
        user.uid,
      )

      return {
        uid: plan.uid,
        name: plan.name,
        active: plan.active,
        url: plan.url,
        year: plan.year,
        deletedAt: plan.deletedAt,
        institutionId: plan.institutionId,
      }
    },
  }),
)
