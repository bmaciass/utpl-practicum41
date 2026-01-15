import type { Db } from '@sigep/db'
import DataLoader from 'dataloader'
import type { ProjectTask } from '~/domain/entities/ProjectTask'
import { getProjectTasksRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createProjectTasksByProjectLoader(db: Db) {
  return new DataLoader<number, ProjectTask[]>(
    async (ids: readonly number[]) => {
      // Fetch all projects for all programs in ONE query
      const projectTaskRepo = getProjectTasksRepository(db)

      const promises = []
      for (const id of ids) {
        promises.push(projectTaskRepo.findByProjectId(id))
      }
      const projectTasks = (await Promise.all(promises)).flat()

      const grouped = new Map<number, ProjectTask[]>()

      for (const projectTask of projectTasks) {
        let projectGoalsByProject = grouped.get(projectTask.projectId)
        if (!projectGoalsByProject) {
          projectGoalsByProject = []
          grouped.set(projectTask.projectId, projectGoalsByProject)
        }
        projectGoalsByProject.push(projectTask)
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
