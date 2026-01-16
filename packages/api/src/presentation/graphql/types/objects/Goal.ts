import type { GoalRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { InstitutionalObjective } from './InstitutionalObjective'

export type TGoal = Pick<
  GoalRecord,
  'name' | 'description' | 'uid' | 'deletedAt' | 'institutionalObjectiveId'
> & { active: boolean }

export const Goal = builder.objectRef<TGoal>('Goal')

Goal.implement({
  fields: (t) => ({
    uid: t.exposeString('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    institutionalObjective: t.field({
      type: InstitutionalObjective,
      resolve: (root, _, { loaders }) => loaders.institutionalObjective.load(root.institutionalObjectiveId)
    }),
    active: t.field({
      type: 'Boolean',
      resolve: (root) => root.deletedAt === null,
    }),
    deletedAt: t.expose('deletedAt', { type: 'DateTime', nullable: true }),
  }),
})
