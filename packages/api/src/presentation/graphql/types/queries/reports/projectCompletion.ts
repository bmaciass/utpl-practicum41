import {
  getProjectObjectiveRepository,
  getProjectRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ReportsQueries } from './root'

type TProjectCompletionReport = {
  completed: number
  total: number
  percentage: number
}

const ProjectCompletionReport = builder
  .objectRef<TProjectCompletionReport>('ProjectCompletionReport')
  .implement({
    fields: (t) => ({
      completed: t.exposeInt('completed'),
      total: t.exposeInt('total'),
      percentage: t.expose('percentage', { type: 'Float' }),
    }),
  })

builder.objectField(ReportsQueries, 'projectCompletion', (t) =>
  t.field({
    type: ProjectCompletionReport,
    nullable: true,
    authScopes: { protected: true },
    args: {
      projectUid: t.arg.string({ required: true }),
    },
    resolve: async (_, { projectUid }, { db }) => {
      const projectRepository = getProjectRepository(db)
      const projectObjectiveRepository = getProjectObjectiveRepository(db)

      const project = await projectRepository.findByUid(projectUid)
      if (!project) {
        return null
      }

      const total = await projectObjectiveRepository.count({
        projectId: project.id,
        active: true,
      })
      if (total === 0) {
        return { completed: 0, total: 0, percentage: 0 }
      }

      const completed = await projectObjectiveRepository.count({
        projectId: project.id,
        active: true,
        status: 'done',
      })

      return {
        completed,
        total,
        percentage: (completed / total) * 100,
      }
    },
  }),
)
