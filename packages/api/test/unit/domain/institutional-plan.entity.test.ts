import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  InstitutionalPlan,
  type CreateInstitutionalPlanProps,
} from '../../../src/domain/entities/InstitutionalPlan'

const baseProps: CreateInstitutionalPlanProps = {
  name: 'Plan de desarrollo 2025',
  description: 'Plan institucional de referencia',
  year: 2025,
  url: 'https://example.com/plan.pdf',
  institutionId: 4,
  createdBy: 1,
}

describe('InstitutionalPlan entity', () => {
  it('rejects short names', () => {
    expect(() =>
      InstitutionalPlan.create({ ...baseProps, name: 'No' }),
    ).toThrow(ValidationError)
  })

  it('rejects years outside the valid range', () => {
    expect(() =>
      InstitutionalPlan.create({ ...baseProps, year: 1999 }),
    ).toThrow(ValidationError)
  })
})
