import { NotFoundError } from '@sigep/shared'
import { GetProjectObjectiveById } from '~/application/use-cases/project-objective'
import { getProjectObjectiveRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import {
  ProjectObjective,
  type TProjectObjective,
} from '../../objects/ProjectObjective'
import { ProjectObjectiveQueries } from './root'

builder.objectField(ProjectObjectiveQueries, 'one', (t) =>
  t.field({
    type: ProjectObjective,
    nullable: false,
    authScopes: { protected: true },
    args: {
      uid: t.arg.string({ required: true }),
    },
    resolve: async (_, { uid }, { db }) => {
      const projectObjectiveRepository = getProjectObjectiveRepository(db)
      const getProjectObjectiveById = new GetProjectObjectiveById({
        projectObjectiveRepository,
      })

      const objective = await getProjectObjectiveById.execute(uid)
      if (!objective) throw new NotFoundError('projectObjective', uid, 'uid')

      return {
        id: objective.id,
        uid: objective.uid,
        name: objective.name,
        status: objective.status,
        active: objective.active,
        deletedAt: objective.deletedAt,
        projectId: objective.projectId,
      } satisfies TProjectObjective
    },
  }),
)
