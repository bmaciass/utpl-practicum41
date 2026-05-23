import {
  type Db,
  AlignmentProjectObjectiveWithODS,
  ObjectiveODS,
  ProjectObjective,
} from '@sigep/db'
import { findByNormalizedName } from './normalizeText'

export async function seedProjectObjectiveODSAlignment(db: Db, userId: number) {
  const projectObjectives = await db.select().from(ProjectObjective)
  const odsObjectives = await db.select().from(ObjectiveODS)

  const findProjectObjective = (pattern: string) =>
    findByNormalizedName(projectObjectives, pattern)
  const findODS = (pattern: string) =>
    findByNormalizedName(odsObjectives, pattern)

  const alignments = [
    {
      projectObjective: 'Mejorar la calidad de datos institucionales',
      ods: ['ODS 9'],
    },
    {
      projectObjective: 'Aumentar la resiliencia de pipelines',
      ods: ['ODS 9'],
    },
    {
      projectObjective: 'Reducir la desercion estudiantil',
      ods: ['ODS 4'],
    },
    {
      projectObjective: 'Fortalecer rutas de acompañamiento estudiantil',
      ods: ['ODS 4', 'ODS 10'],
    },
    {
      projectObjective: 'Mejorar tiempos de respuesta del soporte',
      ods: ['ODS 16'],
    },
    {
      projectObjective: 'Estandarizar catalogo y niveles de servicio',
      ods: ['ODS 16'],
    },
    {
      projectObjective: 'Aumentar cobertura de servicios digitales',
      ods: ['ODS 9', 'ODS 16'],
    },
    {
      projectObjective: 'Conectar servicios academicos y administrativos',
      ods: ['ODS 9'],
    },
    {
      projectObjective: 'Mejorar la continuidad academica',
      ods: ['ODS 4', 'ODS 10'],
    },
    {
      projectObjective:
        'Escalar proyectos de innovacion con impacto territorial',
      ods: ['ODS 8', 'ODS 9', 'ODS 17'],
    },
  ]

  const alignmentRecords = []

  for (const alignment of alignments) {
    const projectObj = findProjectObjective(alignment.projectObjective)
    if (!projectObj) {
      console.warn(`Project objective not found: ${alignment.projectObjective}`)
      continue
    }

    for (const odsPattern of alignment.ods) {
      const odsObj = findODS(odsPattern)
      if (!odsObj) {
        console.warn(`ODS objective not found: ${odsPattern}`)
        continue
      }

      alignmentRecords.push({
        projectObjectiveId: projectObj.id,
        objectiveODSId: odsObj.id,
        createdBy: userId,
      })
    }
  }

  if (alignmentRecords.length > 0) {
    await db.insert(AlignmentProjectObjectiveWithODS).values(alignmentRecords)
  }
}
