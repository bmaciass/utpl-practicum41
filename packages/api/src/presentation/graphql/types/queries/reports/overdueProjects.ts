import { getProjectRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ReportsQueries } from './root'

type TOverdueProjects = { count: number }

const OverdueProjects = builder
  .objectRef<TOverdueProjects>('OverdueProjects')
  .implement({
    fields: (t) => ({
      count: t.exposeInt('count'),
    }),
  })

builder.objectField(ReportsQueries, 'overdueProjects', (t) =>
  t.field({
    type: OverdueProjects,
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
      const count = await getProjectRepository(db).countOverdue({
        referenceDate,
        institutionUid: args.institutionUid ?? undefined,
        programUid: args.programUid ?? undefined,
      })
      return { count }
    },
  }),
)
