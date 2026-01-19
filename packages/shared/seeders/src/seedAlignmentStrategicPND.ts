import {
  type Db,
  AlignmentObjectiveStrategicWithPND,
  InstitutionalEstrategicObjetive,
  ObjectivePND,
} from '@sigep/db'

export async function seedAlignmentStrategicPND(db: Db, userId: number) {
  const strategicObjectives = await db
    .select()
    .from(InstitutionalEstrategicObjetive)
  const pndObjectives = await db.select().from(ObjectivePND)

  const findStrategic = (pattern: string) =>
    strategicObjectives.find((obj) => obj.name.includes(pattern))
  const findPND = (pattern: string) =>
    pndObjectives.find((obj) => obj.name.includes(pattern))

  const alignments = [
    {
      strategic: 'Excelencia',
      pnd: ['Objetivo 2', 'Objetivo 8'],
    },
    {
      strategic: 'Investigacion',
      pnd: ['Objetivo 4', 'Objetivo 5'],
    },
    {
      strategic: 'Vinculacion',
      pnd: ['Objetivo 1', 'Objetivo 9'],
    },
    {
      strategic: 'Gestion Institucional',
      pnd: ['Objetivo 8'],
    },
    {
      strategic: 'Internacionalizacion',
      pnd: ['Objetivo 7'],
    },
    {
      strategic: 'Bienestar',
      pnd: ['Objetivo 1', 'Objetivo 3'],
    },
    {
      strategic: 'Sostenibilidad',
      pnd: ['Objetivo 6', 'Objetivo 9'],
    },
  ]

  const alignmentRecords = []

  for (const alignment of alignments) {
    const strategicObj = findStrategic(alignment.strategic)
    if (!strategicObj) {
      console.warn(`Strategic objective not found: ${alignment.strategic}`)
      continue
    }

    for (const pndPattern of alignment.pnd) {
      const pndObj = findPND(pndPattern)
      if (!pndObj) {
        console.warn(`PND objective not found: ${pndPattern}`)
        continue
      }

      alignmentRecords.push({
        objectiveStrategicId: strategicObj.id,
        objectivePNDId: pndObj.id,
        createdBy: userId,
      })
    }
  }

  if (alignmentRecords.length > 0) {
    await db.insert(AlignmentObjectiveStrategicWithPND).values(alignmentRecords)
  }
}
