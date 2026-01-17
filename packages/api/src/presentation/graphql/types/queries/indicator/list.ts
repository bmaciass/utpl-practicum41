import { ListIndicators } from '~/application/use-cases/indicator'
import {
  getGoalRepository,
  getIndicatorRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Indicator, type TIndicator } from '../../objects/Indicator'
import { IndicatorTypeEnum } from '../../enums/IndicatorType'
import { IndicatorQueries } from './root'

type TIndicatorListFilters = {
  active?: boolean
  goalUid?: string
  search?: string
  type?: 'number' | 'percentage'
}

export const IndicatorListFilters = builder
  .inputRef<TIndicatorListFilters>('IndicatorListFilters')
  .implement({
    fields: (t) => ({
      active: t.boolean(),
      goalUid: t.string(),
      search: t.string(),
      type: t.field({ type: IndicatorTypeEnum, required: false }),
    }),
  })

type TIndicatorListResponse = {
  records: TIndicator[]
}

export const IndicatorListResponse = builder
  .objectRef<TIndicatorListResponse>('IndicatorListResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [Indicator] }),
    }),
  })

builder.objectField(IndicatorQueries, 'list', (t) =>
  t.field({
    type: IndicatorListResponse,
    args: {
      filters: t.arg({ type: IndicatorListFilters }),
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (_, args, { db }) => {
      const indicatorRepo = getIndicatorRepository(db)
      const goalRepo = getGoalRepository(db)

      const useCase = new ListIndicators({
        indicatorRepository: indicatorRepo,
      })

      let goalId: number | undefined
      if (args.filters?.goalUid) {
        const goal = await goalRepo.findByUidOrThrow(args.filters.goalUid)
        goalId = goal.id
      }

      const result = await useCase.execute({
        options: {
          where: {
            active: args.filters?.active ?? undefined,
            goalId,
            search: args.filters?.search ?? undefined,
            type: args.filters?.type ?? undefined,
          },
          limit: args.limit ?? 100,
          offset: args.offset ?? 0,
        },
      })

      return { records: result }
    },
  }),
)
