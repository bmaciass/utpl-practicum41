import {
  type Db,
  Goal,
  InstitutionalEstrategicObjetive,
} from '@sigep/db'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid/non-secure'

type GoalSeed = {
  objectiveName: string
  name: string
  description: string
}

const goalSeeds: GoalSeed[] = [
  {
    objectiveName: 'Excelencia Académica',
    name: 'Actualizar mallas curriculares',
    description:
      'Revisar y actualizar el 100% de las mallas curriculares priorizadas para alinearlas con estándares nacionales e internacionales.',
  },
  {
    objectiveName: 'Excelencia Académica',
    name: 'Formación docente continua',
    description:
      'Implementar un plan anual de formación docente en metodologías activas, evaluación auténtica y uso de tecnología educativa.',
  },
  {
    objectiveName: 'Investigación e Innovación',
    name: 'Convocatoria de proyectos aplicados',
    description:
      'Lanzar una convocatoria semestral de proyectos de investigación aplicada con financiamiento semilla y mentoría.',
  },
  {
    objectiveName: 'Investigación e Innovación',
    name: 'Laboratorios de innovación abierta',
    description:
      'Habilitar laboratorios de innovación abierta para prototipar soluciones con empresas y gobiernos locales.',
  },
  {
    objectiveName: 'Vinculación con la Sociedad',
    name: 'Programa de prácticas comunitarias',
    description:
      'Diseñar prácticas preprofesionales y proyectos de servicio comunitario coordinados con gobiernos locales y ONG.',
  },
  {
    objectiveName: 'Gestión Institucional Eficiente',
    name: 'Digitalizar trámites clave',
    description:
      'Digitalizar los trámites académicos y administrativos de mayor demanda para reducir tiempos de respuesta.',
  },
  {
    objectiveName: 'Internacionalización',
    name: 'Red de convenios y dobles titulaciones',
    description:
      'Ampliar la red de convenios internacionales y establecer al menos un programa de doble titulación por facultad.',
  },
  {
    objectiveName: 'Bienestar Universitario',
    name: 'Programa integral de salud mental',
    description:
      'Implementar servicios de acompañamiento psicoemocional, talleres y campañas de autocuidado para la comunidad.',
  },
  {
    objectiveName: 'Sostenibilidad y Responsabilidad Ambiental',
    name: 'Plan de gestión de residuos y eficiencia energética',
    description:
      'Implementar gestión de residuos, reciclaje y eficiencia energética con metas de reducción anual de consumo.',
  },
]

export async function seedGoals(
  db: Db,
  userId: number,
  institutionId: number,
) {
  const objectives = await db
    .select()
    .from(InstitutionalEstrategicObjetive)
    .where(eq(InstitutionalEstrategicObjetive.institutionId, institutionId))

  const goalsToInsert = goalSeeds
    .map((seed) => {
      const objective = objectives.find((obj) =>
        obj.name.includes(seed.objectiveName),
      )
      if (!objective) {
        console.warn(
          `Objetivo institucional no encontrado para meta: ${seed.objectiveName}`,
        )
        return null
      }
      return {
        uid: nanoid(),
        name: seed.name,
        description: seed.description,
        institutionalObjectiveId: objective.id,
        createdBy: userId,
      }
    })
    .filter(Boolean) as Array<{
    uid: string
    name: string
    description: string
    institutionalObjectiveId: number
    createdBy: number
  }>

  if (!goalsToInsert.length) {
    console.warn('No se insertaron metas; revise los nombres de objetivos.')
    return
  }

  await db.insert(Goal).values(goalsToInsert)
  console.log(`✓ Seeded ${goalsToInsert.length} metas institucionales`)
}
