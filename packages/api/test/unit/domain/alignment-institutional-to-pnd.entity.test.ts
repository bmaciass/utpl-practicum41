import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import { AlignmentInstitutionalToPND } from '../../../src/domain/entities/AlignmentInstitutionalToPND'

describe('AlignmentInstitutionalToPND entity', () => {
  it('rejects missing institutional objective id', () => {
    expect(() =>
      AlignmentInstitutionalToPND.create({
        institutionalObjectiveId: 0,
        pndObjectiveId: 1,
        createdBy: 1,
      }),
    ).toThrow(ValidationError)
  })

  it('rejects missing PND objective id', () => {
    expect(() =>
      AlignmentInstitutionalToPND.create({
        institutionalObjectiveId: 1,
        pndObjectiveId: 0,
        createdBy: 1,
      }),
    ).toThrow(ValidationError)
  })

  it('rejects missing creator id', () => {
    expect(() =>
      AlignmentInstitutionalToPND.create({
        institutionalObjectiveId: 1,
        pndObjectiveId: 1,
        createdBy: 0,
      }),
    ).toThrow(ValidationError)
  })
})
