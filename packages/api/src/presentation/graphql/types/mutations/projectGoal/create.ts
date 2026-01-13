import type { ProjectGoalRecord } from '@sigep/db'
import { CreateProjectGoal } from '~/application/use-cases/project-goal'
import {
  getProjectGoalRepository,
  getProjectRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectGoalStatusEnum } from '../../enums/ProjectGoalStatus'
import { ProjectGoal } from '../../objects/ProjectGoal'
import { ProjectGoalMutations } from './root'

type TCreateProjectGoalDataInput = Pick<
  ProjectGoalRecord,
  'name' | 'startDate' | 'endDate' | 'status'
> & {
  projectUid: string
}

export const CreateProjectGoalDataInput = builder
  .inputRef<TCreateProjectGoalDataInput>('CreateProjectGoalDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      status: t.field({ type: ProjectGoalStatusEnum }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
      projectUid: t.string(),
    }),
  })

builder.objectField(ProjectGoalMutations, 'create', (t) =>
  t.field({
    type: ProjectGoal,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateProjectGoalDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const projectGoalRepository = getProjectGoalRepository(db)
      const projectRepository = getProjectRepository(db)
      const userRepository = getUserRepository(db)
      const createProjectGoal = new CreateProjectGoal({
        projectGoalRepository,
        projectRepository,
        userRepository,
      })

      const goal = await createProjectGoal.execute(
        {
          name: data.name,
          projectUid: data.projectUid,
          status: data.status ?? undefined,
          startDate: data.startDate ?? undefined,
          endDate: data.endDate ?? undefined,
        },
        user.uid,
      )

      return {
        uid: goal.uid,
        name: goal.name,
        status: goal.status,
        startDate: goal.startDate,
        endDate: goal.endDate,
        active: goal.active,
        projectId: goal.projectId,
        deletedAt: goal.deletedAt,
      }
    },
  }),
)
