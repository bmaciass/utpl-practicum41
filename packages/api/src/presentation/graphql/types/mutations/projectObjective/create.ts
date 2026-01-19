import type { ProjectObjectiveRecord } from '@sigep/db'
import { CreateProjectObjective } from '~/application/use-cases/project-objective'
import {
  getProjectObjectiveRepository,
  getProjectRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectObjectiveStatusEnum } from '../../enums/ProjectObjectiveStatus'
import { ProjectObjective } from '../../objects/ProjectObjective'
import { ProjectObjectiveMutations } from './root'

type TCreateProjectObjectiveDataInput = Pick<
  ProjectObjectiveRecord,
  'name' | 'status'
> & {
  projectUid: string
}

export const CreateProjectObjectiveDataInput = builder
  .inputRef<TCreateProjectObjectiveDataInput>('CreateProjectObjectiveDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      status: t.field({ type: ProjectObjectiveStatusEnum }),
      projectUid: t.string(),
    }),
  })

builder.objectField(ProjectObjectiveMutations, 'create', (t) =>
  t.field({
    type: ProjectObjective,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateProjectObjectiveDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const projectObjectiveRepository = getProjectObjectiveRepository(db)
      const projectRepository = getProjectRepository(db)
      const userRepository = getUserRepository(db)
      const createProjectObjective = new CreateProjectObjective({
        projectObjectiveRepository,
        projectRepository,
        userRepository,
      })

      const objective = await createProjectObjective.execute(
        {
          name: data.name,
          status: data.status ?? undefined,
          projectUid: data.projectUid,
        },
        user.uid,
      )

      return {
        id: objective.id,
        uid: objective.uid,
        name: objective.name,
        status: objective.status,
        active: objective.active,
        projectId: objective.projectId,
        deletedAt: objective.deletedAt,
      }
    },
  }),
)
