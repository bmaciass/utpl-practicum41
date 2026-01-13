import type {
  InstitutionArea,
  InstitutionLevel,
} from '~/domain/entities/Institution'

export interface CreateInstitutionDTO {
  name: string
  area: InstitutionArea
  level: InstitutionLevel
}
