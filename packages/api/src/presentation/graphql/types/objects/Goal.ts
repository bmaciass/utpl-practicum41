import type { GoalRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { IndicatorRef } from './Indicator'
import { InstitutionalObjective } from './InstitutionalObjective'

export type TGoal = Pick<
  GoalRecord,
  | 'id'
  | 'name'
  | 'description'
  | 'uid'
  | 'deletedAt'
  | 'institutionalObjectiveId'
> & { active: boolean }

export const GoalRef = builder.objectRef<TGoal>('Goal')

export const Goal = GoalRef.implement({
  fields: (t) => ({
    uid: t.exposeString('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    institutionalObjective: t.field({
      type: InstitutionalObjective,
      resolve: (root, _, { loaders }) =>
        loaders.institutionalObjective.load(root.institutionalObjectiveId),
    }),
    indicators: t.field({
      type: [IndicatorRef],
      resolve: (root, _, { loaders }) => loaders.indicatorsByGoal.load(root.id),
    }),
    active: t.field({
      type: 'Boolean',
      resolve: (root) => root.deletedAt === null,
    }),
    deletedAt: t.expose('deletedAt', { type: 'DateTime', nullable: true }),
  }),
})
