import { describe, expect, it, vi } from 'vitest'
import { CreateProgram } from '../../../../src/application/use-cases/program'

describe('CreateProgram', () => {
  it('resolves the institution and responsible user before saving the program', async () => {
    const institutionRepository = {
      findByUidOrThrow: vi.fn(async () => ({ id: 11, uid: 'inst-1' })),
    }
    const userRepository = {
      findByUidOrThrow: vi
        .fn()
        .mockResolvedValueOnce({ id: 22, uid: 'resp-1' })
        .mockResolvedValueOnce({ id: 33, uid: 'actor-1' }),
    }
    const programRepository = {
      save: vi.fn(async (program) => program),
    }

    const result = await new CreateProgram({
      institutionRepository: institutionRepository as never,
      programRepository: programRepository as never,
      userRepository: userRepository as never,
    }).execute(
      {
        name: 'Programa territorial',
        description: 'Cobertura interinstitucional',
        institutionUid: 'inst-1',
        responsibleUid: 'resp-1',
      },
      'actor-1',
    )

    expect(institutionRepository.findByUidOrThrow).toHaveBeenCalledWith('inst-1')
    expect(programRepository.save).toHaveBeenCalledTimes(1)
    expect(result.institutionId).toBe(11)
    expect(result.responsibleId).toBe(22)
  })
})
