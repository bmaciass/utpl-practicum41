import type {
  InstitutionArea,
  InstitutionLevel,
} from '~/domain/entities/Institution'

export interface InstitutionResponseDTO {
  uid: string
  name: string
  area: InstitutionArea
  level: InstitutionLevel
  active: boolean
  deletedAt: Date | null
}
