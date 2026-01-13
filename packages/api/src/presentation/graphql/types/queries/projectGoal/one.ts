import { GetProjectGoalById } from '~/application/use-cases/project-goal'
import { getProjectGoalRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectGoal, type TProjectGoal } from '../../objects/ProjectGoal'
import { ProjectGoalQueries } from './root'

builder.objectField(ProjectGoalQueries, 'one', (t) =>
  t.field({
    type: ProjectGoal,
    nullable: true,
    authScopes: { protected: true },
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, { id }, { db }) => {
      const projectGoalRepository = getProjectGoalRepository(db)
      const getProjectGoalById = new GetProjectGoalById({
        projectGoalRepository,
      })

      const goal = await getProjectGoalById.execute(id)
      if (!goal) return null

      return {
        uid: goal.uid,
        name: goal.name,
        status: goal.status,
        startDate: goal.startDate,
        endDate: goal.endDate,
        active: goal.active,
        projectId: goal.projectId,
        deletedAt: goal.deletedAt,
      } satisfies TProjectGoal
    },
  }),
)
