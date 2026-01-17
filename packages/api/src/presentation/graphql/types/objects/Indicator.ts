import type { IndicatorRecord } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { getGoalRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../schema/builder'
import { IndicatorTypeEnum } from '../enums/IndicatorType'
import { GoalRef } from './Goal'

export type TIndicator = Pick<
  IndicatorRecord,
  | 'uid'
  | 'name'
  | 'description'
  | 'type'
  | 'unitType'
  | 'minValue'
  | 'maxValue'
  | 'deletedAt'
  | 'goalId'
> & {
  active: boolean
}

export const IndicatorRef = builder.objectRef<TIndicator>('Indicator')

export const Indicator = IndicatorRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    type: t.expose('type', { type: IndicatorTypeEnum, nullable: true }),
    unitType: t.exposeString('unitType', { nullable: true }),
    minValue: t.exposeInt('minValue', { nullable: true }),
    maxValue: t.exposeInt('maxValue', { nullable: true }),
    goal: t.field({
      type: GoalRef,
      resolve: async (indicator, _, { db }) => {
        const goalRepo = getGoalRepository(db)
        const goal = await goalRepo.findById(indicator.goalId)
        if (!goal) {
          throw new NotFoundError('goal', `${indicator.goalId}`, 'id')
        }
        return goal
      },
    }),
    deletedAt: t.expose('deletedAt', { type: 'DateTime', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (indicator) => indicator.deletedAt === null,
    }),
  }),
})
