import {
  type Db,
  AlignmentObjectivePNDWithODS,
  ObjectiveODS,
  ObjectivePND,
} from '@sigep/db'
import { eq } from 'drizzle-orm'

/**
 * Seeds the alignment between PND objectives and ODS goals
 * Based on thematic correspondence following Ecuador's official alignment methodology
 * Reference: Matriz de alineación PND-ODS (Ecuador)
 */
export async function seedPNDODSAlignment(db: Db, userId: number) {
  // Fetch all PND objectives
  const pndObjectives = await db.select().from(ObjectivePND)

  // Fetch all ODS objectives
  const odsObjectives = await db.select().from(ObjectiveODS)

  // Helper function to find objective by name pattern
  const findPND = (pattern: string) =>
    pndObjectives.find((obj) => obj.name.includes(pattern))

  const findODS = (pattern: string) =>
    odsObjectives.find((obj) => obj.name.includes(pattern))

  // Define alignments based on thematic correspondence
  const alignments = [
    // PND Objetivo 1: Bienestar social y calidad de vida
    // Aligns with poverty eradication, health, and inequality reduction
    { pnd: 'Objetivo 1', ods: ['ODS 1', 'ODS 3', 'ODS 10'] },

    // PND Objetivo 2: Educación, cultura y vida activa
    // Aligns with quality education, gender equality through education, and reducing inequalities
    { pnd: 'Objetivo 2', ods: ['ODS 4', 'ODS 5', 'ODS 10'] },

    // PND Objetivo 3: Estado seguro y derechos humanos
    // Aligns with peace, justice, institutions, gender equality, and reducing inequalities
    { pnd: 'Objetivo 3', ods: ['ODS 16', 'ODS 5', 'ODS 10'] },

    // PND Objetivo 4: Desarrollo económico y empleo de calidad
    // Aligns with decent work, economic growth, and poverty reduction
    { pnd: 'Objetivo 4', ods: ['ODS 8', 'ODS 1', 'ODS 10'] },

    // PND Objetivo 5: Producción e inversión con innovación
    // Aligns with industry, innovation, infrastructure, and responsible production
    { pnd: 'Objetivo 5', ods: ['ODS 9', 'ODS 8', 'ODS 12'] },

    // PND Objetivo 6: Recursos naturales y eficiencia energética
    // Aligns with clean energy, climate action, water, life below water, and life on land
    {
      pnd: 'Objetivo 6',
      ods: ['ODS 7', 'ODS 13', 'ODS 6', 'ODS 14', 'ODS 15'],
    },

    // PND Objetivo 7: Infraestructura sostenible y conectividad
    // Aligns with infrastructure, sustainable cities, and energy
    { pnd: 'Objetivo 7', ods: ['ODS 9', 'ODS 11', 'ODS 7'] },

    // PND Objetivo 8: Fortalecimiento institucional
    // Aligns with strong institutions and partnerships
    { pnd: 'Objetivo 8', ods: ['ODS 16', 'ODS 17'] },

    // PND Objetivo 9: Resiliencia ante riesgos
    // Aligns with sustainable cities, climate action, and disaster resilience
    { pnd: 'Objetivo 9', ods: ['ODS 11', 'ODS 13', 'ODS 1'] },
  ]

  // Create alignment records
  const alignmentRecords = []

  for (const alignment of alignments) {
    const pndObj = findPND(alignment.pnd)

    if (!pndObj) {
      console.warn(`PND objective not found: ${alignment.pnd}`)
      continue
    }

    for (const odsPattern of alignment.ods) {
      const odsObj = findODS(odsPattern)

      if (!odsObj) {
        console.warn(`ODS objective not found: ${odsPattern}`)
        continue
      }

      alignmentRecords.push({
        objectivePNDId: pndObj.id,
        objectiveODSId: odsObj.id,
        createdBy: userId,
      })
    }
  }

  // Insert all alignments
  if (alignmentRecords.length > 0) {
    await db.insert(AlignmentObjectivePNDWithODS).values(alignmentRecords)
    console.log(`✓ Created ${alignmentRecords.length} PND-ODS alignments`)
  }
}
