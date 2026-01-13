import { ListProjectGoals } from '~/application/use-cases/project-goal'
import { getProjectGoalRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectGoal, type TProjectGoal } from '../../objects/ProjectGoal'
import { ProjectGoalQueries } from './root'

export type TProjectGoalsQueryResponse = {
  records: TProjectGoal[]
}

export const ProjectGoalsQueryResponse = builder
  .objectRef<TProjectGoalsQueryResponse>('ProjectGoalsQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [ProjectGoal] }),
    }),
  })

builder.objectField(ProjectGoalQueries, 'list', (t) =>
  t.field({
    type: ProjectGoalsQueryResponse,
    authScopes: { protected: true },
    args: {
      // active: t.arg.boolean({ required: false }),
      projectUid: t.arg.string({ required: true }),
    },
    resolve: async (_, { projectUid }, { db }) => {
      const projectGoalRepository = getProjectGoalRepository(db)
      const listProjectGoals = new ListProjectGoals({ projectGoalRepository })

      // TODO: Add filters
      const goals = await listProjectGoals.execute({
        projectUid,
      })

      return {
        records: goals.map((goal) => ({
          uid: goal.uid,
          name: goal.name,
          status: goal.status,
          startDate: goal.startDate,
          endDate: goal.endDate,
          active: goal.active,
          deletedAt: goal.deletedAt,
          projectId: goal.projectId,
        })),
      }
    },
  }),
)
