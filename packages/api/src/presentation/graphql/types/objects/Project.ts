import type { ProjectRecord } from '@sigep/db'
import type { ProjectGoal as ProjectGoalDomain } from '~/domain/entities/ProjectGoal'
import builder from '../../schema/builder'
import { ProjectStatusEnum } from '../enums/ProjectStatus'
import { ProgramRef } from './Program'
import { ProjectGoalRef } from './ProjectGoal'
import { User } from './User'

export type TProject = Pick<
  ProjectRecord,
  | 'id'
  | 'uid'
  | 'name'
  | 'description'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'deletedAt'
  | 'responsibleId'
  | 'programId'
> & {
  active: boolean
  // goalIds: number[]
}

// Export the ref for circular dependency resolution
export const ProjectRef = builder.objectRef<TProject>('Project')

export const Project = ProjectRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    status: t.expose('status', { type: ProjectStatusEnum, nullable: false }),
    startDate: t.expose('startDate', { type: 'Date', nullable: true }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    goals: t.field({
      type: [ProjectGoalRef],
      resolve: async (project, _, { loaders }) => {
        const records = await loaders.projectGoalsByProject.loadMany([
          project.id,
        ])

        return records
          .flat()
          .filter((record) => !(record instanceof Error)) as ProjectGoalDomain[]
      },
    }),
    responsible: t.field({
      type: User,
      resolve: (project, _, { loaders }) => {
        return loaders.user.load(project.responsibleId)
      },
    }),
    program: t.field({
      type: ProgramRef,
      nullable: true,
      resolve: (project, _, { loaders }) => {
        return loaders.program.load(project.programId)
      },
    }),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (project) => project.deletedAt === null,
    }),
  }),
})
