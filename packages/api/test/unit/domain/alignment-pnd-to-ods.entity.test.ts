import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import { AlignmentPNDToODS } from '../../../src/domain/entities/AlignmentPNDToODS'

describe('AlignmentPNDToODS entity', () => {
  it('rejects missing PND objective id', () => {
    expect(() =>
      AlignmentPNDToODS.create({
        pndObjectiveId: 0,
        odsObjectiveId: 1,
        createdBy: 1,
      }),
    ).toThrow(ValidationError)
  })

  it('rejects missing ODS objective id', () => {
    expect(() =>
      AlignmentPNDToODS.create({
        pndObjectiveId: 1,
        odsObjectiveId: 0,
        createdBy: 1,
      }),
    ).toThrow(ValidationError)
  })

  it('rejects missing creator id', () => {
    expect(() =>
      AlignmentPNDToODS.create({
        pndObjectiveId: 1,
        odsObjectiveId: 1,
        createdBy: 0,
      }),
    ).toThrow(ValidationError)
  })
})
