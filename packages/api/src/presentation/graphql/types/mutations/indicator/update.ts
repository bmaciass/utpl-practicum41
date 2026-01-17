import { UpdateIndicator } from '~/application/use-cases/indicator'
import {
  getGoalRepository,
  getIndicatorRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { IndicatorTypeEnum } from '../../enums/IndicatorType'
import { Indicator } from '../../objects/Indicator'
import { IndicatorMutations } from './root'

type TUpdateIndicatorWhereInput = {
  uid: string
}

export const UpdateIndicatorWhereInput = builder
  .inputRef<TUpdateIndicatorWhereInput>('UpdateIndicatorWhereInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateIndicatorDataInput = {
  name?: string
  description?: string | null
  type?: 'number' | 'percentage' | null
  unitType?: string | null
  minValue?: number | null
  maxValue?: number | null
  goalUid?: string
  active?: boolean
}

export const UpdateIndicatorDataInput = builder
  .inputRef<TUpdateIndicatorDataInput>('UpdateIndicatorDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      type: t.field({ type: IndicatorTypeEnum, required: false }),
      unitType: t.string({ required: false }),
      minValue: t.int({ required: false }),
      maxValue: t.int({ required: false }),
      goalUid: t.string({ required: false }),
      active: t.boolean({ required: false }),
    }),
  })

builder.objectField(IndicatorMutations, 'update', (t) =>
  t.field({
    type: Indicator,
    authScopes: { protected: true },
    args: {
      where: t.arg({
        type: UpdateIndicatorWhereInput,
        required: true,
      }),
      data: t.arg({
        type: UpdateIndicatorDataInput,
        required: true,
      }),
    },
    resolve: async (_, { where, data }, { db, user }) => {
      const indicatorRepo = getIndicatorRepository(db)
      const goalRepo = getGoalRepository(db)
      const userRepo = getUserRepository(db)

      const useCase = new UpdateIndicator({
        indicatorRepository: indicatorRepo,
        goalRepository: goalRepo,
        userRepository: userRepo,
      })

      return await useCase.execute(
        {
          uid: where.uid,
          data: {
            name: data.name ?? undefined,
            description: data.description ?? undefined,
            type: data.type ?? undefined,
            unitType: data.unitType ?? undefined,
            minValue: data.minValue ?? undefined,
            maxValue: data.maxValue ?? undefined,
            goalUid: data.goalUid ?? undefined,
            active: data.active ?? undefined,
          },
        },
        user.uid,
      )
    },
  }),
)
