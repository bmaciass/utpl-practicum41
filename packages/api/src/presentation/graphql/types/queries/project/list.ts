import { ListProjects } from '~/application/use-cases/project'
import { getProjectRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Project, type TProject } from '../../objects/Project'
import { ProjectQueries } from './root'

export type TProjectsQueryResponse = {
  records: TProject[]
}

export const ProjectsQueryResponse = builder
  .objectRef<TProjectsQueryResponse>('ProjectsQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [Project] }),
    }),
  })

builder.objectField(ProjectQueries, 'list', (t) =>
  t.field({
    type: ProjectsQueryResponse,
    authScopes: { protected: true },
    args: {
      active: t.arg.boolean({ required: false }),
      programId: t.arg.string({ required: true }),
    },
    resolve: async (_, __, { db }) => {
      const projectRepository = getProjectRepository(db)
      const listProjects = new ListProjects({ projectRepository })

      // TODO: Add filters
      const projects = await listProjects.execute({})

      return {
        records: projects.map((project) => ({
          id: project.id,
          uid: project.uid,
          name: project.name,
          description: project.description,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          active: project.active,
          responsibleId: project.responsibleId,
          deletedAt: project.deletedAt,
          programId: project.programId,
        })),
      }
    },
  }),
)
