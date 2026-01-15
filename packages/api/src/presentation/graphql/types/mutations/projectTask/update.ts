import type { ProjectTaskPayload } from '@sigep/db'
import type { SetOptional } from 'type-fest'
import { UpdateProjectTask } from '~/application/use-cases/project-task'
import {
  getProjectTasksRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectTaskStatusEnum } from '../../enums/ProjectTaskStatus'
import { ProjectTask } from '../../objects/ProjectTask'
import { ProjectTaskMutations } from './root'

type TUpdateProjectTaskWhereInput = {
  uid: string
}

export const UpdateProjectTaskWhereInput = builder
  .inputRef<TUpdateProjectTaskWhereInput>('UpdateProjectTaskWhereInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateProjectTaskDataInput = Pick<
  SetOptional<
    ProjectTaskPayload,
    'name' | 'description' | 'startDate' | 'endDate' | 'status'
  >,
  'name' | 'description' | 'startDate' | 'endDate' | 'status'
> & {
  responsibleUid?: string
  active?: boolean
}

export const UpdateProjectTaskDataInput = builder
  .inputRef<TUpdateProjectTaskDataInput>('UpdateProjectTaskDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      active: t.boolean({ required: false }),
      status: t.field({ type: ProjectTaskStatusEnum, required: false }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
      responsibleUid: t.string({ required: false }),
    }),
  })

builder.objectField(ProjectTaskMutations, 'update', (t) =>
  t.field({
    type: ProjectTask,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateProjectTaskWhereInput, required: true }),
      data: t.arg({ type: UpdateProjectTaskDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const projectTaskRepository = getProjectTasksRepository(db)
      const userRepository = getUserRepository(db)
      const updateProjectTask = new UpdateProjectTask({
        projectTaskRepository,
        userRepository,
      })

      const task = await updateProjectTask.execute(
        {
          uid: where.uid,
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
        uid: task.uid,
        name: task.name,
        description: task.description,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        active: task.active,
        projectId: task.projectId,
        responsibleId: task.responsibleId,
        deletedAt: task.deletedAt,
      }
    },
  }),
)
