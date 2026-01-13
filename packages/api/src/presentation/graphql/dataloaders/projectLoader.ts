import type { Db } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import DataLoader from 'dataloader'
import type { Project } from '~/domain/entities/Project'
import { getProjectRepository } from '~/infrastructure/persistence/drizzle/repositories'

/**
 * Creates a DataLoader for batching Project queries by Program UID
 *
 * This prevents N+1 query problems by automatically batching multiple
 * requests for "projects belonging to program X" into a single database query.
 *
 * Example:
 * - Without DataLoader: 10 programs → 10 separate Project queries
 * - With DataLoader: 10 programs → 1 batched Project query with JOIN
 */
export function createProjectLoader(db: Db) {
  return new DataLoader<number, Project>(
    async (ids: readonly number[]) => {
      // Fetch all projects for all programs in ONE query
      const projectRepo = getProjectRepository(db)
      const projects = await projectRepo.findByIds([...ids])

      const projectsMap = new Map(
        projects.map((project) => [project.id, project]),
      )

      return ids.map((id) => {
        const project = projectsMap.get(id)
        if (!project) throw new NotFoundError('project', `${id}`)

        return project
      })
    },
    {
      // Cache results within a single GraphQL request
      // This means if the same program's projects are requested twice in one query,
      // they're only fetched once
      cache: true,
    },
  )
}
