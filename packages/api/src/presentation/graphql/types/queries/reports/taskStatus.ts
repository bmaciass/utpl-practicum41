import { projectTaskStatusEnum } from '@sigep/db'
import { getProjectTasksRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectTaskStatusEnum } from '../../enums/ProjectTaskStatus'
import { ReportsQueries } from './root'

type TaskStatus = (typeof projectTaskStatusEnum.enumValues)[number]

type TTaskStatusCount = {
  status: TaskStatus
  count: number
}

type TTaskStatusReport = {
  records: TTaskStatusCount[]
}

const TaskStatusCount = builder
  .objectRef<TTaskStatusCount>('TaskStatusCount')
  .implement({
    fields: (t) => ({
      status: t.expose('status', { type: ProjectTaskStatusEnum }),
      count: t.exposeInt('count'),
    }),
  })

const TaskStatusReport = builder
  .objectRef<TTaskStatusReport>('TaskStatusReport')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [TaskStatusCount] }),
    }),
  })

const TASK_STATUSES = projectTaskStatusEnum.enumValues

builder.objectField(ReportsQueries, 'taskStatus', (t) =>
  t.field({
    type: TaskStatusReport,
    authScopes: { protected: true },
    args: {
      institutionUid: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { db }) => {
      const projectTaskRepo = getProjectTasksRepository(db)
      const rows = await projectTaskRepo.countByStatus({
        institutionUid: args.institutionUid ?? undefined,
      })

      const counts = new Map<TaskStatus, number>(
        TASK_STATUSES.map((status) => [status, 0]),
      )

      for (const row of rows) {
        counts.set(row.status, row.count)
      }

      return {
        records: TASK_STATUSES.map((status) => ({
          status,
          count: counts.get(status) ?? 0,
        })),
      }
    },
  }),
)
