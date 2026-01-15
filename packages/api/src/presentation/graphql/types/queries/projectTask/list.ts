import { ListProjectTasks } from '~/application/use-cases/project-task'
import {
  getProjectRepository,
  getProjectTasksRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectTask, type TProjectTask } from '../../objects/ProjectTask'
import { ProjectTaskQueries } from './root'

export type TProjectTasksQueryResponse = {
  records: TProjectTask[]
}

export const ProjectTasksQueryResponse = builder
  .objectRef<TProjectTasksQueryResponse>('ProjectTasksQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [ProjectTask] }),
    }),
  })

builder.objectField(ProjectTaskQueries, 'list', (t) =>
  t.field({
    type: ProjectTasksQueryResponse,
    authScopes: { protected: true },
    args: {
      projectUid: t.arg.string({ required: true }),
      responsibleUid: t.arg.string({ required: false }),
    },
    resolve: async (_, { projectUid }, { db }) => {
      const projectTaskRepository = getProjectTasksRepository(db)
      const projectRepository = getProjectRepository(db)
      const listProjectTasks = new ListProjectTasks({
        projectRepository,
        projectTaskRepository,
      })

      // TODO: Add filters
      const tasks = await listProjectTasks.execute({
        projectUid,
      })

      return {
        records: tasks.map((goal) => ({
          uid: goal.uid,
          name: goal.name,
          description: goal.description,
          status: goal.status,
          startDate: goal.startDate,
          endDate: goal.endDate,
          active: goal.active,
          deletedAt: goal.deletedAt,
          projectId: goal.projectId,
          responsibleId: goal.responsibleId,
        })),
      }
    },
  }),
)
