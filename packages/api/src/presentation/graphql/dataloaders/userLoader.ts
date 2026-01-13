import type { Db } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import DataLoader from 'dataloader'
import type { User } from '~/domain/entities/User'
import { getUserRepository } from '~/infrastructure/persistence/drizzle/repositories'

/**
 * Creates a DataLoader for batching User queries by UID
 *
 * This prevents N+1 query problems by automatically batching multiple
 * individual user loads into a single database query.
 *
 * Example:
 * - Without DataLoader: 10 programs → 10 separate User queries
 * - With DataLoader: 10 programs → 1 batched User query
 */
export function createUserLoader(db: Db) {
  return new DataLoader<number, User>(
    async (ids: readonly number[]) => {
      // Fetch all users in ONE query
      const userRepo = getUserRepository(db)
      const users = await userRepo.findByIds([...ids])

      // Create a map for fast lookup: uid → User
      const userMap = new Map(users.map((u) => [u.id, u]))

      // CRITICAL: Return users in the SAME ORDER as requested uids
      // DataLoader requires this to match results back to requests
      return ids.map((id) => {
        const user = userMap.get(id)
        if (!user) {
          throw new NotFoundError('user', `${id}`)
        }
        return user
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
