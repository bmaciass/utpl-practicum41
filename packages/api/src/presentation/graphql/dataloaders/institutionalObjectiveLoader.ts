import type { Db } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import DataLoader from 'dataloader'
import type { InstitutionalObjective } from '~/domain/entities/InstitutionalObjective'
import { getInstitutionalObjectiveRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createInstitutionalObjectiveLoader(db: Db) {
  return new DataLoader<number, InstitutionalObjective>(
    async (ids: readonly number[]) => {
      // Fetch all institutions in ONE query
      const institutionalObjectiveRepo = getInstitutionalObjectiveRepository(db)
      const institutionalObjectives =
        await institutionalObjectiveRepo.findByIds([...ids])

      // Create a map for fast lookup: uid → User
      const institutionObjectivesMap = new Map(
        institutionalObjectives.map((u) => [u.id, u]),
      )

      // CRITICAL: Return institutions in the SAME ORDER as requested uids
      // DataLoader requires this to match results back to requests
      return ids.map((id) => {
        const institutionObjective = institutionObjectivesMap.get(id)
        if (!institutionObjective) {
          throw new NotFoundError('institutionObjective', `${id}`, 'id')
        }
        return institutionObjective
      })
    },
    {
      // Cache results within a single GraphQL request
      // This means if the same user is requested twice in one query,
      // it's only fetched once
      cache: true,
    },
  )
}
