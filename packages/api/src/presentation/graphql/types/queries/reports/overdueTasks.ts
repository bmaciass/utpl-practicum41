import { getProjectTasksRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ReportsQueries } from './root'

type TOverdueTasks = { count: number }

const OverdueTasks = builder
  .objectRef<TOverdueTasks>('OverdueTasks')
  .implement({
    fields: (t) => ({
      count: t.exposeInt('count'),
    }),
  })

builder.objectField(ReportsQueries, 'overdueTasks', (t) =>
  t.field({
    type: OverdueTasks,
    authScopes: { protected: true },
    args: {
      referenceDate: t.arg.string({ required: false }),
      institutionUid: t.arg.string({ required: false }),
      programUid: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { db }) => {
      const referenceDate = args.referenceDate
        ? new Date(args.referenceDate)
        : new Date()
      const count = await getProjectTasksRepository(db).countOverdue({
        referenceDate,
        institutionUid: args.institutionUid ?? undefined,
        programUid: args.programUid ?? undefined,
      })
      return { count }
    },
  }),
)
