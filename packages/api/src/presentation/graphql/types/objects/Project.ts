import type { ProjectRecord } from '@sigep/db'
import type { ProjectObjective as ProjectObjectiveDomain } from '~/domain/entities/ProjectObjective'
import type { ProjectTask as ProjectTaskDomain } from '~/domain/entities/ProjectTask'
import builder from '../../schema/builder'
import { ProjectStatusEnum } from '../enums/ProjectStatus'
import { ProgramRef } from './Program'
import { ProjectObjectiveRef } from './ProjectObjective'
import { ProjectTaskRef } from './ProjectTask'
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
    tasks: t.field({
      type: [ProjectTaskRef],
      resolve: async (project, _, { loaders }) => {
        const records = await loaders.projectGoalsByProject.loadMany([
          project.id,
        ])

        return records
          .flat()
          .filter((record) => !(record instanceof Error)) as ProjectTaskDomain[]
      },
    }),
    objectives: t.field({
      type: [ProjectObjectiveRef],
      resolve: async (project, _args, { loaders }) => {
        const records = await loaders.projectObjectivesByProject.loadMany([
          project.id,
        ])

        return records
          .flat()
          .filter(
            (record) => !(record instanceof Error),
          ) as ProjectObjectiveDomain[]
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
