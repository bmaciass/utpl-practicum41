import { ListGoals } from '~/application/use-cases/goal'
import {
  getGoalRepository,
  getInstitutionalObjectiveRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Goal, type TGoal } from '../../objects/Goal'
import { GoalQueries } from './root'

type TGoalListFilters = {
  active?: boolean
  institutionalObjectiveUid?: string
  search?: string
}

export const GoalListFilters = builder
  .inputRef<TGoalListFilters>('GoalListFilters')
  .implement({
    fields: (t) => ({
      active: t.boolean(),
      institutionalObjectiveUid: t.string(),
      search: t.string(),
    }),
  })

type TGoalListResponse = {
  records: TGoal[]
}

export const GoalListResponse = builder
  .objectRef<TGoalListResponse>('GoalListResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [Goal] }),
    }),
  })

builder.objectField(GoalQueries, 'list', (t) =>
  t.field({
    type: GoalListResponse,
    args: {
      filters: t.arg({ type: GoalListFilters }),
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (_, args, { db }) => {
      const goalRepo = getGoalRepository(db)
      const institutionalObjectiveRepo = getInstitutionalObjectiveRepository(db)

      const useCase = new ListGoals({
        goalRepository: goalRepo,
        institutionalObjectiveRepository: institutionalObjectiveRepo,
      })

      // Convert institutionalObjectiveUid to institutionalObjectiveId
      let institutionalObjectiveId: number | undefined
      if (args.filters?.institutionalObjectiveUid) {
        const objective = await institutionalObjectiveRepo.findByUidOrThrow(
          args.filters.institutionalObjectiveUid,
        )
        institutionalObjectiveId = objective.id
      }

      const result = await useCase.execute({
        options: {
          where: {
            active: args.filters?.active ?? undefined,
            institutionalObjectiveId,
            search: args.filters?.search ?? undefined,
          },
          // limit: args.limit ?? 100,
          // offset: args.offset ?? 0,
        },
      })

      return { records: result }
    },
  }),
)
