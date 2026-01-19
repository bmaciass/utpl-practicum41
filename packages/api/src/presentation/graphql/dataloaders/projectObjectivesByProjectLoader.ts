import type { Db } from '@sigep/db'
import DataLoader from 'dataloader'
import type { ProjectObjective } from '~/domain/entities/ProjectObjective'
import { getProjectObjectiveRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createProjectObjectivesByProjectLoader(db: Db) {
  return new DataLoader<number, ProjectObjective[]>(
    async (ids: readonly number[]) => {
      const projectObjectiveRepo = getProjectObjectiveRepository(db)

      const promises = []
      for (const id of ids) {
        promises.push(projectObjectiveRepo.findByProjectId(id))
      }
      const objectives = (await Promise.all(promises)).flat()

      const grouped = new Map<number, ProjectObjective[]>()
      for (const objective of objectives) {
        let objectivesByProject = grouped.get(objective.projectId)
        if (!objectivesByProject) {
          objectivesByProject = []
          grouped.set(objective.projectId, objectivesByProject)
        }
        objectivesByProject.push(objective)
      }

      return Array.from(grouped.values())
    },
    {
      cache: true,
    },
  )
}
