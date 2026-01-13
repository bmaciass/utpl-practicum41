import type { Db } from '@sigep/db'
import DataLoader from 'dataloader'
import type { ProjectGoal } from '~/domain/entities/ProjectGoal'
import { getProjectGoalRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createProjectGoalsByProjectLoader(db: Db) {
  return new DataLoader<number, ProjectGoal[]>(
    async (ids: readonly number[]) => {
      // Fetch all projects for all programs in ONE query
      const projectGoalRepo = getProjectGoalRepository(db)

      const promises = []
      for (const id of ids) {
        promises.push(projectGoalRepo.findByProjectId(id))
      }
      const projectGoals = (await Promise.all(promises)).flat()

      const grouped = new Map<number, ProjectGoal[]>()

      for (const projectGoal of projectGoals) {
        let projectGoalsByProject = grouped.get(projectGoal.projectId)
        if (!projectGoalsByProject) {
          projectGoalsByProject = []
          grouped.set(projectGoal.projectId, projectGoalsByProject)
        }
        projectGoalsByProject.push(projectGoal)
      }

      return Array.from(grouped.values())
    },
    {
      // Cache results within a single GraphQL request
      // This means if the same program's projects are requested twice in one query,
      // they're only fetched once
      cache: true,
    },
  )
}
