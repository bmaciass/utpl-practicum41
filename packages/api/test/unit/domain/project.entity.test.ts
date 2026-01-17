import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import { Project, type CreateProjectProps } from '../../../src/domain/entities/Project'

const baseProps: CreateProjectProps = {
  name: 'Campus renewal',
  description: 'Renovate key campus facilities over the next year.',
  responsibleId: 8,
  programId: 3,
  createdBy: 4,
}

describe('Project entity', () => {
  it('rejects short names', () => {
    expect(() => Project.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })
})
