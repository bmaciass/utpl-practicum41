import type { ProjectGoalRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { ProjectGoalStatusEnum } from '../enums/ProjectGoalStatus'

export type TProjectGoal = Pick<
  ProjectGoalRecord,
  | 'uid'
  | 'name'
  | 'startDate'
  | 'endDate'
  | 'deletedAt'
  | 'status'
  | 'projectId'
> & {
  active: boolean
}

export const ProjectGoalRef = builder.objectRef<TProjectGoal>('ProjectGoal')

export const ProjectGoal = ProjectGoalRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    startDate: t.expose('startDate', { type: 'Date', nullable: true }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    // TODO: Add project dataloader
    status: t.expose('status', { type: ProjectGoalStatusEnum }),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (projectGoal) => projectGoal.deletedAt === null,
    }),
  }),
})
