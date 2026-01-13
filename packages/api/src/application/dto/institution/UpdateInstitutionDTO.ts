import type {
  InstitutionArea,
  InstitutionLevel,
} from '~/domain/entities/Institution'

export interface UpdateInstitutionDTO {
  name?: string
  area?: InstitutionArea
  level?: InstitutionLevel
  active?: boolean
}
