import type { AlignmentInstitutionalToPND } from '~/domain/entities/AlignmentInstitutionalToPND'
import type { AlignmentPNDToODS } from '~/domain/entities/AlignmentPNDToODS'
import type { AlignmentProjectObjectiveToODS } from '~/domain/entities/AlignmentProjectObjectiveToODS'
import type { InstitutionalObjective } from '~/domain/entities/InstitutionalObjective'
import type { ObjectiveODS } from '~/domain/entities/ObjectiveODS'
import type { ObjectivePND } from '~/domain/entities/ObjectivePND'
import type { ProjectObjective } from '~/domain/entities/ProjectObjective'
import type {
  AlignmentInstitutionalToPNDResponseDTO,
  AlignmentPNDToODSResponseDTO,
  AlignmentProjectObjectiveToODSResponseDTO,
} from '../dto/alignment'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AlignmentMapper {
  static toInstitutionalToPNDDTO(
    alignment: AlignmentInstitutionalToPND,
    institutional: InstitutionalObjective,
    pnd: ObjectivePND,
  ): AlignmentInstitutionalToPNDResponseDTO {
    return {
      id: alignment.id,
      institutionalObjective: {
        id: institutional.id,
        uid: institutional.uid,
        name: institutional.name,
      },
      pndObjective: {
        id: institutional.id,
        uid: pnd.uid,
        name: pnd.name,
      },
      createdAt: alignment.createdAt,
    }
  }

  static toPNDToODSDTO(
    alignment: AlignmentPNDToODS,
    pnd: ObjectivePND,
    ods: ObjectiveODS,
  ): AlignmentPNDToODSResponseDTO {
    return {
      id: alignment.id,
      pndObjective: {
        id: pnd.id,
        uid: pnd.uid,
        name: pnd.name,
      },
      odsObjective: {
        id: pnd.id,
        uid: ods.uid,
        name: ods.name,
      },
      createdAt: alignment.createdAt,
    }
  }

  static toProjectObjectiveToODSDTO(
    alignment: AlignmentProjectObjectiveToODS,
    projectObjective: ProjectObjective,
    ods: ObjectiveODS,
  ): AlignmentProjectObjectiveToODSResponseDTO {
    return {
      id: alignment.id,
      projectObjective: {
        id: projectObjective.id,
        uid: projectObjective.uid,
        name: projectObjective.name,
      },
      odsObjective: {
        id: ods.id,
        uid: ods.uid,
        name: ods.name,
      },
      createdAt: alignment.createdAt,
    }
  }
}
