import type { Db } from '@sigep/db'
import DataLoader from 'dataloader'
import type { Indicator } from '~/domain/entities/Indicator'
import { getIndicatorRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createIndicatorsByGoalLoader(db: Db) {
  return new DataLoader<number, Indicator[]>(
    async (goalIds: readonly number[]) => {
      const indicatorRepo = getIndicatorRepository(db)
      const indicators = await indicatorRepo.findByGoalIds([...goalIds])

      const grouped = new Map<number, Indicator[]>()
      for (const indicator of indicators) {
        const list = grouped.get(indicator.goalId) ?? []
        list.push(indicator)
        grouped.set(indicator.goalId, list)
      }

      return goalIds.map((goalId) => grouped.get(goalId) ?? [])
    },
    {
      cache: true,
    },
  )
}
