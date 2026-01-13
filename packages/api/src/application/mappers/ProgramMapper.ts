import type { Program } from '~/domain/entities/Program'
import type { ProgramResponseDTO } from '../dto/program'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProgramMapper {
  static toDTO(program: Program): ProgramResponseDTO {
    return {
      id: program.id,
      uid: program.uid,
      name: program.name,
      description: program.description ?? null,
      startDate: program.startDate ?? null,
      endDate: program.endDate ?? null,
      active: program.active,
      deletedAt: program.deletedAt,
      responsibleId: program.responsibleId,
    }
  }

  static toDTOList(entities: Program[]): ProgramResponseDTO[] {
    return entities.map(ProgramMapper.toDTO)
  }
}
