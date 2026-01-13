import { GetProjectById } from '~/application/use-cases/project'
import { getProjectRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Project, type TProject } from '../../objects/Project'
import { ProjectQueries } from './root'

builder.objectField(ProjectQueries, 'one', (t) =>
  t.field({
    type: Project,
    nullable: true,
    authScopes: { protected: true },
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, { id }, { db }) => {
      const projectRepository = getProjectRepository(db)
      const getProjectById = new GetProjectById({ projectRepository })

      const project = await getProjectById.execute(id)
      if (!project) return null

      return {
        id: project.id,
        uid: project.uid,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        active: project.active,
        deletedAt: project.deletedAt,
        programId: project.programId,
        responsibleId: project.responsibleId,
      } satisfies TProject
    },
  }),
)
