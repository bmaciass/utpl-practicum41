import type { ProjectGoalPayload } from '@sigep/db'
import type { SetOptional } from 'type-fest'
import { UpdateProjectGoal } from '~/application/use-cases/project-goal'
import { getProjectGoalRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectGoalStatusEnum } from '../../enums/ProjectGoalStatus'
import { ProjectGoal } from '../../objects/ProjectGoal'
import { ProjectGoalMutations } from './root'

type TUpdateProjectGoalWhereInput = {
  id: string
}

export const UpdateProjectGoalWhereInput = builder
  .inputRef<TUpdateProjectGoalWhereInput>('UpdateProjectGoalWhereInput')
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  })

type TUpdateProjectGoalDataInput = Pick<
  SetOptional<ProjectGoalPayload, 'name' | 'startDate' | 'endDate' | 'status'>,
  'name' | 'startDate' | 'endDate' | 'status'
> & {
  active?: boolean
}

export const UpdateProjectGoalDataInput = builder
  .inputRef<TUpdateProjectGoalDataInput>('UpdateProjectGoalDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      active: t.boolean({ required: false }),
      status: t.field({ type: ProjectGoalStatusEnum, required: false }),
      startDate: t.field({ type: 'Date', required: false }),
      endDate: t.field({ type: 'Date', required: false }),
    }),
  })

builder.objectField(ProjectGoalMutations, 'update', (t) =>
  t.field({
    type: ProjectGoal,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateProjectGoalWhereInput, required: true }),
      data: t.arg({ type: UpdateProjectGoalDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const projectGoalRepository = getProjectGoalRepository(db)
      const updateProjectGoal = new UpdateProjectGoal({ projectGoalRepository })

      const goal = await updateProjectGoal.execute(
        {
          uid: where.id,
          data: {
            name: data.name ?? undefined,
            status: data.status ?? undefined,
            startDate: data.startDate ?? undefined,
            endDate: data.endDate ?? undefined,
            active: data.active ?? undefined,
          },
        },
        user.uid,
      )

      return {
        uid: goal.uid,
        name: goal.name,
        status: goal.status,
        startDate: goal.startDate,
        endDate: goal.endDate,
        active: goal.active,
        projectId: goal.projectId,
        deletedAt: goal.deletedAt,
      }
    },
  }),
)
