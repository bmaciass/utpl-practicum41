import type { Db } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import DataLoader from 'dataloader'
import type { Institution } from '~/domain/entities/Institution'
import { getInstitutionRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createInstitutionLoader(db: Db) {
  return new DataLoader<number, Institution>(
    async (ids: readonly number[]) => {
      // Fetch all institutions in ONE query
      const institutionRepo = getInstitutionRepository(db)
      const institutions = await institutionRepo.findByIds([...ids])

      // Create a map for fast lookup: uid → User
      const institutionsMap = new Map(institutions.map((u) => [u.id, u]))

      // CRITICAL: Return institutions in the SAME ORDER as requested uids
      // DataLoader requires this to match results back to requests
      return ids.map((id) => {
        const institution = institutionsMap.get(id)
        if (!institution) {
          throw new NotFoundError('institution', `${id}`)
        }
        return institution
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
