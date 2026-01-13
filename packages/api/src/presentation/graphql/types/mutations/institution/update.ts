import { UpdateInstitution } from '~/application/use-cases/institution'
import type {
  InstitutionArea,
  InstitutionLevel,
} from '~/domain/entities/Institution'
import { getInstitutionRepository } from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionAreaEnum } from '../../enums/InstitutionArea'
import { InstitutionLevelEnum } from '../../enums/InstitutionLevel'
import { Institution } from '../../objects/Institution'
import { InstitutionMutations } from './root'

type TUpdateInstitutionWhereInput = {
  id: string
}

export const UpdateInstitutionWhereInput = builder
  .inputRef<TUpdateInstitutionWhereInput>('UpdateInstitutionWhereInput')
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  })

type TUpdateInstitutionDataInput = {
  name?: string
  area?: InstitutionArea
  level?: InstitutionLevel
  active?: boolean
}

export const UpdateInstitutionDataInput = builder
  .inputRef<TUpdateInstitutionDataInput>('UpdateInstitutionDataInput')
  .implement({
    fields: (t) => ({
      area: t.field({ type: InstitutionAreaEnum, required: false }),
      level: t.field({ type: InstitutionLevelEnum, required: false }),
      name: t.string({ required: false }),
      active: t.boolean({ required: false }),
    }),
  })

builder.objectField(InstitutionMutations, 'update', (t) =>
  t.field({
    type: Institution,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateInstitutionWhereInput, required: true }),
      data: t.arg({ type: UpdateInstitutionDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const institutionRepository = getInstitutionRepository(db)
      const updateInstitution = new UpdateInstitution({ institutionRepository })

      const institution = await updateInstitution.execute(
        {
          uid: where.id,
          data: {
            name: data.name ?? undefined,
            area: data.area ?? undefined,
            level: data.level ?? undefined,
            active: data.active ?? undefined,
          },
        },
        user.uid,
      )

      return { ...institution, objetives: [] }
    },
  }),
)
