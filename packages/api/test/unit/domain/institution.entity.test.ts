import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  Institution,
  type CreateInstitutionProps,
} from '../../../src/domain/entities/Institution'

const baseProps: CreateInstitutionProps = {
  name: 'Universidad Tecnica Particular de Loja',
  area: 'educacion',
  level: 'nacional',
  createdBy: 1,
}

describe('Institution entity', () => {
  it('rejects short names', () => {
    expect(() => Institution.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })

  it('rejects overly long names', () => {
    expect(() =>
      Institution.create({ ...baseProps, name: 'a'.repeat(129) }),
    ).toThrow(ValidationError)
  })
})
