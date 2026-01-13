import type { ProjectRecord } from '@sigep/db'
import { CreateProject } from '~/application/use-cases/project'
import {
  getProgramRepository,
  getProjectRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectStatusEnum } from '../../enums/ProjectStatus'
import { Project } from '../../objects/Project'
import { ProjectMutations } from './root'

type TCreateProjectDataInput = Pick<
  ProjectRecord,
  'name' | 'description' | 'startDate' | 'endDate' | 'status'
> & {
  programUid: string
  responsibleUid: string
}

export const CreateProjectDataInput = builder
  .inputRef<TCreateProjectDataInput>('CreateProjectDataInput')
  .implement({
    fields: (t) => ({
      name: t.string(),
      description: t.string(),
      status: t.field({ type: ProjectStatusEnum }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
      responsibleUid: t.string(),
      programUid: t.string(),
    }),
  })

builder.objectField(ProjectMutations, 'create', (t) =>
  t.field({
    type: Project,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateProjectDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const programRepository = getProgramRepository(db)
      const projectRepository = getProjectRepository(db)
      const userRepository = getUserRepository(db)
      const createProject = new CreateProject({
        programRepository,
        projectRepository,
        userRepository,
      })
      const project = await createProject.execute(
        {
          name: data.name,
          description: data.description,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          responsibleUid: data.responsibleUid,
          programUid: data.programUid,
        },
        user.uid,
      )

      return {
        id: project.id,
        uid: project.uid,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        active: project.active,
        deletedAt: project.deletedAt,
        programId: project.programId,
        responsibleId: project.responsibleId,
      }
    },
  }),
)
