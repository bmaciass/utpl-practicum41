import { ListProjectObjectives } from '~/application/use-cases/project-objective'
import {
  getProjectObjectiveRepository,
  getProjectRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectObjectiveStatusEnum } from '../../enums/ProjectObjectiveStatus'
import {
  ProjectObjective,
  type TProjectObjective,
} from '../../objects/ProjectObjective'
import { ProjectObjectiveQueries } from './root'

export type TProjectObjectivesQueryResponse = {
  records: TProjectObjective[]
}

export const ProjectObjectivesQueryResponse = builder
  .objectRef<TProjectObjectivesQueryResponse>('ProjectObjectivesQueryResponse')
  .implement({
    fields: (t) => ({
      records: t.expose('records', { type: [ProjectObjective] }),
    }),
  })

builder.objectField(ProjectObjectiveQueries, 'list', (t) =>
  t.field({
    type: ProjectObjectivesQueryResponse,
    authScopes: { protected: true },
    args: {
      projectUid: t.arg.string({ required: true }),
      status: t.arg({ type: ProjectObjectiveStatusEnum, required: false }),
      active: t.arg.boolean({ required: false }),
    },
    resolve: async (_, { projectUid, status, active }, { db }) => {
      const projectObjectiveRepository = getProjectObjectiveRepository(db)
      const projectRepository = getProjectRepository(db)
      const listProjectObjectives = new ListProjectObjectives({
        projectRepository,
        projectObjectiveRepository,
      })

      const objectives = await listProjectObjectives.execute({
        projectUid,
        where: {
          status: status ?? undefined,
          active: active ?? undefined,
        },
      })

      return {
        records: objectives.map((objective) => ({
          id: objective.id,
          uid: objective.uid,
          name: objective.name,
          status: objective.status,
          active: objective.active,
          deletedAt: objective.deletedAt,
          projectId: objective.projectId,
        })),
      }
    },
  }),
)
