import { projectStatusEnum } from '@sigep/db'
import { getProjectRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectStatusEnum } from '../../enums/ProjectStatus'
import { ReportsQueries } from './root'

type TProjectStatusCount = {
  status: ProjectStatus
  count: number
}

type TProjectStatusReport = {
  records: TProjectStatusCount[]
}

const ProjectStatusCount = builder
  .objectRef<TProjectStatusCount>('ProjectStatusCount')
  .implement({
    fields: (t) => ({
      status: t.expose('status', { type: ProjectStatusEnum }),
      count: t.exposeInt('count'),
    }),
  })

const ProjectStatusReport = builder
  .objectRef<TProjectStatusReport>('ProjectStatusReport')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [ProjectStatusCount] }),
    }),
  })

type ProjectStatus = (typeof projectStatusEnum.enumValues)[number]

const PROJECT_STATUSES = projectStatusEnum.enumValues

builder.objectField(ReportsQueries, 'projectStatus', (t) =>
  t.field({
    type: ProjectStatusReport,
    authScopes: { protected: true },
    args: {
      institutionUid: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { db }) => {
      const projectRepository = getProjectRepository(db)
      const rows = await projectRepository.countByStatus({
        institutionUid: args.institutionUid ?? undefined,
      })

      const counts = new Map<ProjectStatus, number>(
        PROJECT_STATUSES.map((status) => [status, 0]),
      )

      for (const row of rows) {
        counts.set(row.status, row.count)
      }

      return {
        records: PROJECT_STATUSES.map((status) => ({
          status,
          count: counts.get(status) ?? 0,
        })),
      }
    },
  }),
)
