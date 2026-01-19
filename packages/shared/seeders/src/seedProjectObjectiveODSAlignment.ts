import {
  type Db,
  AlignmentProjectObjectiveWithODS,
  ObjectiveODS,
  ProjectObjective,
} from '@sigep/db'

export async function seedProjectObjectiveODSAlignment(db: Db, userId: number) {
  const projectObjectives = await db.select().from(ProjectObjective)
  const odsObjectives = await db.select().from(ObjectiveODS)

  const findProjectObjective = (pattern: string) =>
    projectObjectives.find((obj) => obj.name.includes(pattern))
  const findODS = (pattern: string) =>
    odsObjectives.find((obj) => obj.name.includes(pattern))

  const alignments = [
    { projectObjective: 'calidad de datos', ods: ['ODS 9'] },
    { projectObjective: 'resiliencia de pipelines', ods: ['ODS 9'] },
    { projectObjective: 'desercion estudiantil', ods: ['ODS 4'] },
    { projectObjective: 'tiempos de respuesta del soporte', ods: ['ODS 16'] },
    { projectObjective: 'Simplificar aprobaciones internas', ods: ['ODS 16'] },
    { projectObjective: 'cobertura de servicios digitales', ods: ['ODS 9'] },
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
