import type { Db } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import DataLoader from 'dataloader'
import type { Program } from '~/domain/entities/Program'
import { getProgramRepository } from '~/infrastructure/persistence/drizzle/repositories'

export function createProgramLoader(db: Db) {
  return new DataLoader<number, Program>(
    async (ids: readonly number[]) => {
      const programRepo = getProgramRepository(db)
      const programs = await programRepo.findByIds([...ids])

      const programsMap = new Map(
        programs.map((project) => [project.id, project]),
      )

      return ids.map((id) => {
        const project = programsMap.get(id)
        if (!project) throw new NotFoundError('program', `${id}`)

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
