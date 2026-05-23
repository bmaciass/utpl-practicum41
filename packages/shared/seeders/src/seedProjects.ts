import { type Db, Project, ProjectObjective, ProjectTask } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

type ProjectSeed = {
  key: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'done' | 'cancelled'
  programKey: string
  responsibleUserName: string
  startDate?: Date
  endDate?: Date
}

type TaskSeed = {
  projectKey: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'reviewing' | 'done' | 'cancelled'
  responsibleUserName: string
  startDate?: Date
  endDate?: Date
}

type ObjectiveSeed = {
  projectKey: string
  name: string
  status: 'pending' | 'in_progress' | 'reviewing' | 'done' | 'cancelled'
}

const projectSeeds: ProjectSeed[] = [
  {
    key: 'data-platform',
    name: 'Actualizacion de plataforma de datos',
    description:
      'Renovar tuberias de datos y bases de reportes para mayor confiabilidad.',
    status: 'in_progress',
    programKey: 'transformacion-digital',
    responsibleUserName: 'bryan',
    startDate: new Date('2025-01-15'),
  },
  {
    key: 'student-tracking',
    name: 'Sistema de seguimiento estudiantil',
    description: 'Centralizar seguimiento de avance y alertas estudiantiles.',
    status: 'done',
    programKey: 'permanencia-estudiantil',
    responsibleUserName: 'ana',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-11-30'),
  },
  {
    key: 'service-desk',
    name: 'Modernizacion de mesa de servicio',
    description: 'Mejorar herramientas y flujos de respuesta de soporte.',
    status: 'pending',
    programKey: 'transformacion-digital',
    responsibleUserName: 'luis',
    startDate: new Date('2025-06-01'),
  },
  {
    key: 'campus-digital',
    name: 'Despliegue de campus digital',
    description: 'Habilitar servicios digitales para operaciones de campus.',
    status: 'in_progress',
    programKey: 'transformacion-digital',
    responsibleUserName: 'maria',
    startDate: new Date('2025-03-10'),
  },
  {
    key: 'retention-network',
    name: 'Red de alerta temprana y permanencia',
    description:
      'Articular analitica, tutorias y bienestar para intervenir riesgo de desercion.',
    status: 'in_progress',
    programKey: 'permanencia-estudiantil',
    responsibleUserName: 'ana',
    startDate: new Date('2025-02-03'),
  },
  {
    key: 'innovation-labs',
    name: 'Laboratorios de innovacion territorial',
    description:
      'Coordinar laboratorios de innovación aplicada con municipios y organizaciones locales.',
    status: 'pending',
    programKey: 'innovacion-vinculacion',
    responsibleUserName: 'sofia',
    startDate: new Date('2025-07-01'),
  },
  {
    key: 'process-optimization',
    name: 'Optimizacion de procesos',
    description: 'Agilizar entregas y aprobaciones internas prioritarias.',
    status: 'cancelled',
    programKey: 'transformacion-digital',
    responsibleUserName: 'maria',
    startDate: new Date('2024-08-05'),
    endDate: new Date('2024-10-21'),
  },
]

const taskSeeds: TaskSeed[] = [
  {
    projectKey: 'data-platform',
    name: 'Inventario de fuentes',
    description: 'Identificar fuentes y evaluar calidad de datos.',
    status: 'in_progress',
    responsibleUserName: 'bryan',
    startDate: new Date('2025-01-20'),
  },
  {
    projectKey: 'data-platform',
    name: 'Plan de normalizacion',
    description: 'Definir cambios de esquema y reglas de normalizacion.',
    status: 'reviewing',
    responsibleUserName: 'luis',
    startDate: new Date('2025-02-10'),
    endDate: new Date('2025-04-15'),
  },
  {
    projectKey: 'data-platform',
    name: 'Refactor de pipelines',
    description: 'Refactorizar pipelines para monitoreo y resiliencia.',
    status: 'pending',
    responsibleUserName: 'bryan',
  },
  {
    projectKey: 'data-platform',
    name: 'Catalogo institucional de datos',
    description:
      'Publicar catalogo de dominios, responsables y reglas de calidad.',
    status: 'pending',
    responsibleUserName: 'luis',
  },
  {
    projectKey: 'student-tracking',
    name: 'Migracion de historicos',
    description: 'Migrar historicos al nuevo sistema.',
    status: 'done',
    responsibleUserName: 'ana',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-15'),
  },
  {
    projectKey: 'student-tracking',
    name: 'Capacitacion a personal',
    description: 'Capacitar al personal en los nuevos tableros.',
    status: 'done',
    responsibleUserName: 'ana',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-08-20'),
  },
  {
    projectKey: 'student-tracking',
    name: 'Integracion con bienestar universitario',
    description:
      'Conectar alertas academicas con flujos de acompañamiento y bienestar.',
    status: 'done',
    responsibleUserName: 'ana',
    startDate: new Date('2024-08-25'),
    endDate: new Date('2024-10-15'),
  },
  {
    projectKey: 'service-desk',
    name: 'Levantamiento de requerimientos',
    description: 'Recolectar requerimientos de los equipos de soporte.',
    status: 'pending',
    responsibleUserName: 'luis',
  },
  {
    projectKey: 'service-desk',
    name: 'Shortlist de herramientas',
    description: 'Evaluar proveedores y preseleccionar opciones.',
    status: 'pending',
    responsibleUserName: 'maria',
  },
  {
    projectKey: 'service-desk',
    name: 'Diseno de portal de autoservicio',
    description:
      'Disenar base de conocimiento y flujos de autoservicio para usuarios.',
    status: 'pending',
    responsibleUserName: 'luis',
  },
  {
    projectKey: 'campus-digital',
    name: 'Lanzamiento piloto',
    description: 'Lanzar servicios piloto en un campus.',
    status: 'in_progress',
    responsibleUserName: 'maria',
    startDate: new Date('2025-03-25'),
  },
  {
    projectKey: 'campus-digital',
    name: 'Consolidacion de feedback',
    description: 'Consolidar feedback del piloto para la siguiente iteracion.',
    status: 'pending',
    responsibleUserName: 'bryan',
  },
  {
    projectKey: 'campus-digital',
    name: 'Integracion con identidad institucional',
    description: 'Integrar acceso unificado y trazabilidad de sesiones.',
    status: 'in_progress',
    responsibleUserName: 'bryan',
  },
  {
    projectKey: 'retention-network',
    name: 'Modelo de riesgo academico',
    description: 'Entrenar y validar indicadores para alertas tempranas.',
    status: 'in_progress',
    responsibleUserName: 'ana',
    startDate: new Date('2025-02-10'),
  },
  {
    projectKey: 'retention-network',
    name: 'Ruta de derivacion y tutoria',
    description:
      'Definir protocolos de derivación, tutoria y seguimiento por casos.',
    status: 'reviewing',
    responsibleUserName: 'sofia',
  },
  {
    projectKey: 'retention-network',
    name: 'Seguimiento de cohortes prioritarias',
    description:
      'Monitorear cohortes con mayor riesgo académico y socioeconómico.',
    status: 'pending',
    responsibleUserName: 'ana',
  },
  {
    projectKey: 'innovation-labs',
    name: 'Mapa de aliados territoriales',
    description:
      'Priorizar municipios, empresas y organizaciones para laboratorios.',
    status: 'pending',
    responsibleUserName: 'sofia',
  },
  {
    projectKey: 'innovation-labs',
    name: 'Convocatoria de retos',
    description:
      'Abrir convocatoria de retos de innovación con criterios de impacto.',
    status: 'pending',
    responsibleUserName: 'maria',
  },
  {
    projectKey: 'process-optimization',
    name: 'Mapeo de procesos',
    description: 'Documentar flujos actuales de procesos.',
    status: 'cancelled',
    responsibleUserName: 'maria',
    startDate: new Date('2024-08-10'),
    endDate: new Date('2024-09-05'),
  },
  {
    projectKey: 'process-optimization',
    name: 'Propuesta de optimizacion',
    description: 'Proponer recomendaciones de optimizacion.',
    status: 'cancelled',
    responsibleUserName: 'luis',
    startDate: new Date('2024-09-06'),
    endDate: new Date('2024-10-15'),
  },
]

const objectiveSeeds: ObjectiveSeed[] = [
  {
    projectKey: 'data-platform',
    name: 'Mejorar la calidad de datos institucionales',
    status: 'in_progress',
  },
  {
    projectKey: 'data-platform',
    name: 'Aumentar la resiliencia de pipelines',
    status: 'pending',
  },
  {
    projectKey: 'student-tracking',
    name: 'Reducir la desercion estudiantil',
    status: 'done',
  },
  {
    projectKey: 'student-tracking',
    name: 'Fortalecer rutas de acompañamiento estudiantil',
    status: 'done',
  },
  {
    projectKey: 'service-desk',
    name: 'Mejorar tiempos de respuesta del soporte',
    status: 'pending',
  },
  {
    projectKey: 'service-desk',
    name: 'Estandarizar catalogo y niveles de servicio',
    status: 'pending',
  },
  {
    projectKey: 'process-optimization',
    name: 'Simplificar aprobaciones internas',
    status: 'cancelled',
  },
  {
    projectKey: 'campus-digital',
    name: 'Aumentar cobertura de servicios digitales',
    status: 'in_progress',
  },
  {
    projectKey: 'campus-digital',
    name: 'Conectar servicios academicos y administrativos',
    status: 'in_progress',
  },
  {
    projectKey: 'retention-network',
    name: 'Mejorar la continuidad academica',
    status: 'in_progress',
  },
  {
    projectKey: 'innovation-labs',
    name: 'Escalar proyectos de innovacion con impacto territorial',
    status: 'pending',
  },
]

function requireSeedReference(
  value: number | undefined,
  kind: 'user' | 'program' | 'project',
  key: string,
) {
  if (!value) {
    throw new Error(`Missing ${kind} seed reference for "${key}"`)
  }

  return value
}

export async function seedProjects(
  db: Db,
  adminUserId: number,
  userIds: Record<string, number>,
  programIds: Record<string, number>,
) {
  const projects = await db
    .insert(Project)
    .values(
      projectSeeds.map((project) => ({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        createdBy: adminUserId,
        responsibleId: requireSeedReference(
          userIds[project.responsibleUserName],
          'user',
          project.responsibleUserName,
        ),
        programId: requireSeedReference(
          programIds[project.programKey],
          'program',
          project.programKey,
        ),
        uid: nanoid(),
      })),
    )
    .returning()

  const projectByKey = new Map(
    projects.map((project, index) => [projectSeeds[index].key, project.id]),
  )

  const objectives: Array<{
    name: string
    status: 'pending' | 'in_progress' | 'reviewing' | 'done' | 'cancelled'
    projectId: number
    createdBy: number
    uid: string
  }> = objectiveSeeds.map((objective) => {
    return {
      name: objective.name,
      status: objective.status,
      projectId: requireSeedReference(
        projectByKey.get(objective.projectKey),
        'project',
        objective.projectKey,
      ),
      createdBy: adminUserId,
      uid: nanoid(),
    }
  })

  if (objectives.length) {
    await db.insert(ProjectObjective).values(objectives)
  }

  const tasks: Array<{
    name: string
    description: string
    status: 'pending' | 'in_progress' | 'reviewing' | 'done' | 'cancelled'
    projectId: number
    createdBy: number
    responsibleId: number
    startDate?: Date
    endDate?: Date
    uid: string
  }> = taskSeeds.map((task) => {
    return {
      name: task.name,
      description: task.description,
      status: task.status,
      projectId: requireSeedReference(
        projectByKey.get(task.projectKey),
        'project',
        task.projectKey,
      ),
      createdBy: adminUserId,
      responsibleId: requireSeedReference(
        userIds[task.responsibleUserName],
        'user',
        task.responsibleUserName,
      ),
      startDate: task.startDate,
      endDate: task.endDate,
      uid: nanoid(),
    }
  })

  if (tasks.length) {
    await db.insert(ProjectTask).values(tasks)
  }
}
