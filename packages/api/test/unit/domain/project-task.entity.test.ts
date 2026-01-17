import { ValidationError } from '@sigep/shared'
import { describe, expect, it } from 'vitest'
import {
  ProjectTask,
  type CreateProjectTaskProps,
} from '../../../src/domain/entities/ProjectTask'

const baseProps: CreateProjectTaskProps = {
  name: 'Review proposals',
  description: 'Review submitted proposals for funding decisions.',
  projectId: 3,
  responsibleId: 5,
  createdBy: 2,
}

describe('ProjectTask entity', () => {
  it('rejects short names', () => {
    expect(() => ProjectTask.create({ ...baseProps, name: 'No' })).toThrow(
      ValidationError,
    )
  })
})
