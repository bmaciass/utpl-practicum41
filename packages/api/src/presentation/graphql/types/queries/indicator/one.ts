import { GetIndicatorById } from '~/application/use-cases/indicator'
import { getIndicatorRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Indicator } from '../../objects/Indicator'
import { IndicatorQueries } from './root'

builder.objectField(IndicatorQueries, 'one', (t) =>
  t.field({
    type: Indicator,
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { db }) => {
      const indicatorRepo = getIndicatorRepository(db)

      const useCase = new GetIndicatorById({
        indicatorRepository: indicatorRepo,
      })

      return await useCase.execute({ uid: args.uid })
    },
  }),
)
