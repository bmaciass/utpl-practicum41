import { GetGoalById } from '~/application/use-cases/goal'
import {
  getGoalRepository
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { Goal } from '../../objects/Goal'
import { GoalQueries } from './root'

builder.objectField(GoalQueries, 'one', (t) =>
  t.field({
    type: Goal,
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, args, { db }) => {
      const goalRepo = getGoalRepository(db)

      const useCase = new GetGoalById({
        goalRepository: goalRepo
      })

      return await useCase.execute({ uid: args.uid })
    },
  }),
)
