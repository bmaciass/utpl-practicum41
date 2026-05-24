import { describe, expect, it, vi } from 'vitest'
import { ListPrograms } from '../../../../src/application/use-cases/program'

describe('ListPrograms', () => {
  it('resolves institutionUid into institutionId when filtering programs', async () => {
    const institutionRepository = {
      findByUidOrThrow: vi.fn(async () => ({ id: 7, uid: 'inst-1' })),
    }
    const programRepository = {
      findMany: vi.fn(async () => []),
    }

    await new ListPrograms({
      institutionRepository: institutionRepository as never,
      programRepository: programRepository as never,
    }).execute({
      institutionUid: 'inst-1',
      where: {
        active: true,
        name: { contains: 'territorial' },
      },
    })

    expect(institutionRepository.findByUidOrThrow).toHaveBeenCalledWith('inst-1')
    expect(programRepository.findMany).toHaveBeenCalledWith({
      where: {
        active: true,
        institutionId: 7,
        name: { contains: 'territorial' },
      },
      pagination: undefined,
    })
  })
})
