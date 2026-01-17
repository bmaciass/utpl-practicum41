import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  InstitutionalObjective,
  type CreateInstitutionalObjectiveProps,
} from '../../../src/domain/entities/InstitutionalObjective'

const baseProps: CreateInstitutionalObjectiveProps = {
  name: 'Enhance academic quality',
  description: 'Drive continuous improvement across teaching and research.',
  institutionId: 5,
  createdBy: 2,
}

describe('InstitutionalObjective entity', () => {
  it('rejects short names', () => {
    expect(() =>
      InstitutionalObjective.create({ ...baseProps, name: 'No' }),
    ).toThrow(ValidationError)
  })

  it('rejects short descriptions', () => {
    expect(() =>
      InstitutionalObjective.create({ ...baseProps, description: 'Too short' }),
    ).toThrow(ValidationError)
  })
})
