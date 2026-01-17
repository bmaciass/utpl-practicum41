import { CreateInstitution } from '~/application/use-cases/institution'
import type {
  InstitutionArea,
  InstitutionLevel,
} from '~/domain/entities/Institution'
import {
  getInstitutionRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { InstitutionAreaEnum } from '../../enums/InstitutionArea'
import { InstitutionLevelEnum } from '../../enums/InstitutionLevel'
import { Institution } from '../../objects/Institution'
import { InstitutionMutations } from './root'

type TCreateInstitutionDataInput = {
  name: string
  area: InstitutionArea
  level: InstitutionLevel
}

export const CreateInstitutionDataInput = builder
  .inputRef<TCreateInstitutionDataInput>('CreateInstitutionDataInput')
  .implement({
    fields: (t) => ({
      area: t.field({ type: InstitutionAreaEnum, required: true }),
      level: t.field({ type: InstitutionLevelEnum, required: true }),
      name: t.string({ required: true }),
    }),
  })

builder.objectField(InstitutionMutations, 'create', (t) =>
  t.field({
    type: Institution,
    authScopes: { protected: true },
    args: {
      data: t.arg({ type: CreateInstitutionDataInput, required: true }),
    },
    resolve: async (_, { data }, { db, user }) => {
      const institutionRepository = getInstitutionRepository(db)
      const userRepository = getUserRepository(db)
      const createInstitution = new CreateInstitution({
        institutionRepository,
        userRepository,
      })

      const institution = await createInstitution.execute(
        {
          name: data.name,
          area: data.area,
          level: data.level,
        },
        user.uid,
      )

      return { ...institution, objetives: [] }
    },
  }),
)
