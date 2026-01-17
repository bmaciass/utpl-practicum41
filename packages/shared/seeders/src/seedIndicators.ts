import {
  type Db,
  Goal,
  Indicator,
  InstitutionalEstrategicObjetive,
} from '@sigep/db'
import { eq, inArray } from 'drizzle-orm'
import { nanoid } from 'nanoid/non-secure'

type IndicatorSeed = {
  goalName: string
  name: string
  description: string
  type: 'number' | 'percentage'
  unitType: string
  minValue?: number
  maxValue?: number
}

const indicatorSeeds: IndicatorSeed[] = [
  {
    goalName: 'Actualizar mallas',
    name: 'Mallas curriculares actualizadas',
    description: 'Porcentaje de mallas actualizadas respecto al plan anual.',
    type: 'percentage',
    unitType: '%',
    minValue: 0,
    maxValue: 100,
  },
  {
    goalName: 'Formacion docente',
    name: 'Docentes capacitados',
    description: 'Numero de docentes certificados en metodologias activas.',
    type: 'number',
    unitType: 'docentes',
    minValue: 0,
    maxValue: 500,
  },
  {
    goalName: 'Convocatoria de proyectos',
    name: 'Proyectos financiados',
    description: 'Cantidad de proyectos de investigacion financiados.',
    type: 'number',
    unitType: 'proyectos',
    minValue: 0,
    maxValue: 60,
  },
  {
    goalName: 'Digitalizar tramites',
    name: 'Tramites digitalizados',
    description: 'Porcentaje de tramites digitalizados en el periodo.',
    type: 'percentage',
    unitType: '%',
    minValue: 0,
    maxValue: 100,
  },
  {
    goalName: 'Red de convenios',
    name: 'Convenios internacionales',
    description: 'Numero de convenios internacionales activos.',
    type: 'number',
    unitType: 'convenios',
    minValue: 0,
    maxValue: 120,
  },
  {
    goalName: 'salud mental',
    name: 'Participacion en programas de bienestar',
    description: 'Participantes en programas de salud mental y bienestar.',
    type: 'number',
    unitType: 'personas',
    minValue: 0,
    maxValue: 3000,
  },
]

export async function seedIndicators(
  db: Db,
  userId: number,
  institutionId: number,
) {
  const objectives = await db
    .select()
    .from(InstitutionalEstrategicObjetive)
    .where(eq(InstitutionalEstrategicObjetive.institutionId, institutionId))

  const objectiveIds = objectives.map((objective) => objective.id)
  if (!objectiveIds.length) {
    console.warn('No institutional objectives found for indicators.')
    return
  }

  const goals = await db
    .select()
    .from(Goal)
    .where(inArray(Goal.institutionalObjectiveId, objectiveIds))

  const indicatorsToInsert = indicatorSeeds
    .map((seed) => {
      const goal = goals.find((item) => item.name.includes(seed.goalName))
      if (!goal) {
        console.warn(`Goal not found for indicator: ${seed.goalName}`)
        return null
      }
      return {
        uid: nanoid(),
        name: seed.name,
        description: seed.description,
        type: seed.type,
        unitType: seed.unitType,
        minValue: seed.minValue,
        maxValue: seed.maxValue,
        goalId: goal.id,
        createdBy: userId,
      }
    })
    .filter(Boolean) as Array<{
    uid: string
    name: string
    description: string
    type: 'number' | 'percentage'
    unitType: string
    minValue?: number
    maxValue?: number
    goalId: number
    createdBy: number
  }>

  if (!indicatorsToInsert.length) {
    console.warn('No indicators inserted; review goal names.')
    return
  }

  await db.insert(Indicator).values(indicatorsToInsert)
}
