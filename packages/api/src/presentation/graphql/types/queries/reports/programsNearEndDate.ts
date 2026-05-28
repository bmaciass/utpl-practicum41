import { getProgramRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ReportsQueries } from './root'

type TProgramsNearEndDate = { count: number }

const ProgramsNearEndDate = builder
  .objectRef<TProgramsNearEndDate>('ProgramsNearEndDate')
  .implement({
    fields: (t) => ({
      count: t.exposeInt('count'),
    }),
  })

builder.objectField(ReportsQueries, 'programsNearEndDate', (t) =>
  t.field({
    type: ProgramsNearEndDate,
    authScopes: { protected: true },
    args: {
      fromDate: t.arg.string({ required: false }),
      toDate: t.arg.string({ required: false }),
      institutionUid: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { db }) => {
      const fromDate = args.fromDate ? new Date(args.fromDate) : undefined
      const toDate = args.toDate ? new Date(args.toDate) : undefined
      const count = await getProgramRepository(db).countNearingEndDate({
        fromDate,
        toDate,
        institutionUid: args.institutionUid ?? undefined,
      })
      return { count }
    },
  }),
)
