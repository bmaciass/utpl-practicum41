import type { ProjectTaskRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { ProjectTaskStatusEnum } from '../enums/ProjectTaskStatus'
import { User } from './User'

export type TProjectTask = Pick<
  ProjectTaskRecord,
  | 'uid'
  | 'name'
  | 'description'
  | 'startDate'
  | 'endDate'
  | 'deletedAt'
  | 'status'
  | 'projectId'
  | 'responsibleId'
> & {
  active: boolean
}

export const ProjectTaskRef = builder.objectRef<TProjectTask>('ProjectTask')

export const ProjectTask = ProjectTaskRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    startDate: t.expose('startDate', { type: 'Date', nullable: true }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    // TODO: Add project dataloader
    status: t.expose('status', { type: ProjectTaskStatusEnum }),
    responsible: t.field({
      type: User,
      resolve: (task, _, { loaders }) => {
        return loaders.user.load(task.responsibleId)
      },
    }),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (projectGoal) => projectGoal.deletedAt === null,
    }),
  }),
})
