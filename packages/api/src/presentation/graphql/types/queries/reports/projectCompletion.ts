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

export function calculateProjectCompletionReport(input: {
  totalActiveObjectives: number
  completedObjectives: number
  cancelledObjectives: number
}): TProjectCompletionReport {
  const actionableTotal = Math.max(
    input.totalActiveObjectives - input.cancelledObjectives,
    0,
  )

  if (actionableTotal === 0) {
    return { completed: 0, total: 0, percentage: 0 }
  }

  const completed = Math.min(input.completedObjectives, actionableTotal)

  return {
    completed,
    total: actionableTotal,
    percentage: (completed / actionableTotal) * 100,
  }
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
      const completed = await projectObjectiveRepository.count({
        projectId: project.id,
        active: true,
        status: 'done',
      })
      const cancelled = await projectObjectiveRepository.count({
        projectId: project.id,
        active: true,
        status: 'cancelled',
      })

      return calculateProjectCompletionReport({
        totalActiveObjectives: total,
        completedObjectives: completed,
        cancelledObjectives: cancelled,
      })
    },
  }),
)
