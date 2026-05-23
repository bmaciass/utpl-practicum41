import {
  type Db,
  Goal,
  Indicator,
  InstitutionalEstrategicObjetive,
} from '@sigep/db'
import { eq, inArray } from 'drizzle-orm'
import { nanoid } from 'nanoid/non-secure'
import { normalizeText } from './normalizeText'

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
  {
    goalName: 'Actualizar mallas curriculares',
    name: 'Carreras con rediseño validado',
    description:
      'Cantidad de carreras con rediseño curricular validado por comités académicos.',
    type: 'number',
    unitType: 'carreras',
    minValue: 0,
    maxValue: 40,
  },
  {
    goalName: 'Laboratorios de innovación abierta',
    name: 'Retos prototipados con aliados',
    description:
      'Numero de retos de innovación prototipados junto con empresas y gobiernos locales.',
    type: 'number',
    unitType: 'retos',
    minValue: 0,
    maxValue: 30,
  },
  {
    goalName: 'Portafolio de proyectos territoriales',
    name: 'Convenios territoriales activos',
    description:
      'Cantidad de convenios activos que respaldan proyectos territoriales vigentes.',
    type: 'number',
    unitType: 'convenios',
    minValue: 0,
    maxValue: 80,
  },
  {
    goalName: 'Tablero integral de seguimiento institucional',
    name: 'Unidades con seguimiento mensual',
    description:
      'Porcentaje de unidades que reportan avances mensuales en el tablero institucional.',
    type: 'percentage',
    unitType: '%',
    minValue: 0,
    maxValue: 100,
  },
  {
    goalName: 'Movilidad saliente y entrante',
    name: 'Participantes en movilidad internacional',
    description:
      'Cantidad de estudiantes y docentes participantes en movilidad internacional.',
    type: 'number',
    unitType: 'participantes',
    minValue: 0,
    maxValue: 1000,
  },
  {
    goalName: 'Plan de permanencia y acompañamiento',
    name: 'Estudiantes acompañados',
    description:
      'Numero de estudiantes atendidos con tutorías, becas o alertas tempranas.',
    type: 'number',
    unitType: 'estudiantes',
    minValue: 0,
    maxValue: 15000,
  },
  {
    goalName: 'Campus sostenible y movilidad limpia',
    name: 'Reduccion de emisiones operativas',
    description:
      'Porcentaje de reducción de emisiones operativas asociadas a movilidad y consumo.',
    type: 'percentage',
    unitType: '%',
    minValue: 0,
    maxValue: 100,
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

  const goalByName = new Map(
    goals.map((goal) => [normalizeText(goal.name), goal]),
  )

  const indicatorsToInsert = indicatorSeeds
    .map((seed) => {
      const goal =
        goalByName.get(normalizeText(seed.goalName)) ??
        goals.find((item) =>
          normalizeText(item.name).includes(normalizeText(seed.goalName)),
        )
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
