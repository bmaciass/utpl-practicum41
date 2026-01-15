import type { ProjectTaskRecord } from '@sigep/db'
import { CreateProjectGoal } from '~/application/use-cases/project-task'
import {
  getProjectRepository,
  getProjectTasksRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectTaskStatusEnum } from '../../enums/ProjectTaskStatus'
import { ProjectTask } from '../../objects/ProjectTask'
import { ProjectTaskMutations } from './root'

type TCreateProjectTaskDataInput = Pick<
  ProjectTaskRecord,
  'name' | 'description' | 'startDate' | 'endDate' | 'status'
> & {
  projectUid: string
  responsibleUid: string
}

export const CreateProjectTaskDataInput = builder
  .inputRef<TCreateProjectTaskDataInput>('CreateProjectTaskDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      description: t.string({ required: false }),
      status: t.field({ type: ProjectTaskStatusEnum }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
      projectUid: t.string(),
      responsibleUid: t.string(),
    }),
  })

builder.objectField(ProjectTaskMutations, 'create', (t) =>
  t.field({
    type: ProjectTask,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateProjectTaskDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const projectGoalRepository = getProjectTasksRepository(db)
      const projectRepository = getProjectRepository(db)
      const userRepository = getUserRepository(db)
      const createProjectGoal = new CreateProjectGoal({
        projectTaskRepository: projectGoalRepository,
        projectRepository,
        userRepository,
      })

      const goal = await createProjectGoal.execute(
        {
          name: data.name,
          description: data.description ?? null,
          projectUid: data.projectUid,
          responsibleUid: data.responsibleUid,
          status: data.status ?? undefined,
          startDate: data.startDate ?? undefined,
          endDate: data.endDate ?? undefined,
        },
        user.uid,
      )

      return {
        uid: goal.uid,
        name: goal.name,
        description: goal.description,
        status: goal.status,
        startDate: goal.startDate,
        endDate: goal.endDate,
        active: goal.active,
        projectId: goal.projectId,
        responsibleId: goal.responsibleId,
        deletedAt: goal.deletedAt,
      }
    },
  }),
)
