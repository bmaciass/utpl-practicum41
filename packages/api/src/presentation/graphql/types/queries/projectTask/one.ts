import { NotFoundError } from '@sigep/shared'
import { GetProjectTaskById } from '~/application/use-cases/project-task'
import { getProjectTasksRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectTask, type TProjectTask } from '../../objects/ProjectTask'
import { ProjectTaskQueries } from './root'

builder.objectField(ProjectTaskQueries, 'one', (t) =>
  t.field({
    type: ProjectTask,
    nullable: false,
    authScopes: { protected: true },
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, { uid }, { db }) => {
      const projectTaskRepository = getProjectTasksRepository(db)
      const getProjectTaskById = new GetProjectTaskById({
        projectTaskRepository: projectTaskRepository,
      })

      const task = await getProjectTaskById.execute(uid)
      if (!task) throw new NotFoundError('projectTask', uid, 'uid')

      return {
        uid: task.uid,
        name: task.name,
        description: task.description,
        responsibleId: task.responsibleId,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        active: task.active,
        projectId: task.projectId,
        deletedAt: task.deletedAt,
      } satisfies TProjectTask
    },
  }),
)
