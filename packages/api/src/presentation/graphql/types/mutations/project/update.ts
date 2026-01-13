import type { ProjectPayload } from '@sigep/db'
import type { SetOptional } from 'type-fest'
import { UpdateProject } from '~/application/use-cases/project'
import {
  getProjectRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectStatusEnum } from '../../enums/ProjectStatus'
import { Project } from '../../objects/Project'
import { ProjectMutations } from './root'

type TUpdateProjectWhereInput = {
  id: string
}

export const UpdateProjectWhereInput = builder
  .inputRef<TUpdateProjectWhereInput>('UpdateProjectWhereInput')
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  })

type TUpdateProjectDataInput = Pick<
  SetOptional<
    ProjectPayload,
    'name' | 'description' | 'startDate' | 'endDate' | 'status'
  >,
  'name' | 'description' | 'startDate' | 'endDate' | 'status'
> & {
  active?: boolean
  responsibleUid?: string
}

export const UpdateProjectDataInput = builder
  .inputRef<TUpdateProjectDataInput>('UpdateProjectDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      active: t.boolean({ required: false }),
      description: t.string({ required: false }),
      responsibleUid: t.string({ required: false }),
      status: t.field({ type: ProjectStatusEnum, required: false }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
    }),
  })

builder.objectField(ProjectMutations, 'update', (t) =>
  t.field({
    type: Project,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateProjectWhereInput, required: true }),
      data: t.arg({ type: UpdateProjectDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const projectRepository = getProjectRepository(db)
      const userRepository = getUserRepository(db)
      const updateProject = new UpdateProject({
        projectRepository,
        userRepository,
      })
      const project = await updateProject.execute(
        {
          uid: where.id,
          data: {
            name: data.name ?? undefined,
            description: data.description ?? undefined,
            status: data.status ?? undefined,
            startDate: data.startDate ?? undefined,
            endDate: data.endDate ?? undefined,
            responsibleUid: data.responsibleUid ?? undefined,
            active: data.active ?? undefined,
          },
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
        deletedAt: project.deletedAt,
        active: project.active,
        programId: project.programId,
        responsibleId: project.responsibleId,
      }
    },
  }),
)
