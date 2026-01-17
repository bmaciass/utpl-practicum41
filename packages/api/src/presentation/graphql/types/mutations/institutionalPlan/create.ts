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
  description: string
  url?: string | null
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
      description: t.string(),
      institutionId: t.string(),
      url: t.string({ required: false }),
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
          description: data.description,
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
        description: plan.description,
        deletedAt: plan.deletedAt,
        institutionId: plan.institutionId,
      }
    },
  }),
)
