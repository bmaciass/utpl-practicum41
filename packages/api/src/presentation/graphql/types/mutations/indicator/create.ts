import { CreateIndicator } from '~/application/use-cases/indicator'
import {
  getGoalRepository,
  getIndicatorRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { IndicatorTypeEnum } from '../../enums/IndicatorType'
import { Indicator } from '../../objects/Indicator'
import { IndicatorMutations } from './root'

type TCreateIndicatorDataInput = {
  name: string
  description?: string | null
  type?: 'number' | 'percentage' | null
  unitType?: string | null
  minValue?: number | null
  maxValue?: number | null
  goalUid: string
}

export const CreateIndicatorDataInput = builder
  .inputRef<TCreateIndicatorDataInput>('CreateIndicatorDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      type: t.field({ type: IndicatorTypeEnum, required: false }),
      unitType: t.string({ required: false }),
      minValue: t.int({ required: false }),
      maxValue: t.int({ required: false }),
      goalUid: t.string({ required: true }),
    }),
  })

builder.objectField(IndicatorMutations, 'create', (t) =>
  t.field({
    type: Indicator,
    authScopes: { protected: true },
    args: {
      data: t.arg({
        type: CreateIndicatorDataInput,
        required: true,
      }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const indicatorRepo = getIndicatorRepository(db)
      const goalRepo = getGoalRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new CreateIndicator({
        indicatorRepository: indicatorRepo,
        goalRepository: goalRepo,
        userRepository: userRepo,
      })

      return await useCase.execute(data, user.uid)
    },
  }),
)
