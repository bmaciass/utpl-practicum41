import { type Db, Project, ProjectTask } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

type ProjectSeed = {
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'done' | 'cancelled'
}

type TaskSeed = {
  projectName: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'reviewing' | 'done' | 'cancelled'
}

const projectSeeds: ProjectSeed[] = [
  {
    name: 'Actualizacion de plataforma de datos',
    description:
      'Renovar tuberias de datos y bases de reportes para mayor confiabilidad.',
    status: 'in_progress',
  },
  {
    name: 'Sistema de seguimiento estudiantil',
    description: 'Centralizar seguimiento de avance y alertas estudiantiles.',
    status: 'done',
  },
  {
    name: 'Modernizacion de mesa de servicio',
    description: 'Mejorar herramientas y flujos de respuesta de soporte.',
    status: 'pending',
  },
  {
    name: 'Optimizacion de procesos',
    description: 'Agilizar entregas y aprobaciones internas prioritarias.',
    status: 'cancelled',
  },
  {
    name: 'Despliegue de campus digital',
    description: 'Habilitar servicios digitales para operaciones de campus.',
    status: 'in_progress',
  },
]

const taskSeeds: TaskSeed[] = [
  {
    projectName: 'Actualizacion de plataforma de datos',
    name: 'Inventario de fuentes',
    description: 'Identificar fuentes y evaluar calidad de datos.',
    status: 'in_progress',
  },
  {
    projectName: 'Actualizacion de plataforma de datos',
    name: 'Plan de normalizacion',
    description: 'Definir cambios de esquema y reglas de normalizacion.',
    status: 'reviewing',
  },
  {
    projectName: 'Actualizacion de plataforma de datos',
    name: 'Refactor de pipelines',
    description: 'Refactorizar pipelines para monitoreo y resiliencia.',
    status: 'pending',
  },
  {
    projectName: 'Sistema de seguimiento estudiantil',
    name: 'Migracion de historicos',
    description: 'Migrar historicos al nuevo sistema.',
    status: 'done',
  },
  {
    projectName: 'Sistema de seguimiento estudiantil',
    name: 'Capacitacion a personal',
    description: 'Capacitar al personal en los nuevos tableros.',
    status: 'done',
  },
  {
    projectName: 'Modernizacion de mesa de servicio',
    name: 'Levantamiento de requerimientos',
    description: 'Recolectar requerimientos de los equipos de soporte.',
    status: 'pending',
  },
  {
    projectName: 'Modernizacion de mesa de servicio',
    name: 'Shortlist de herramientas',
    description: 'Evaluar proveedores y preseleccionar opciones.',
    status: 'pending',
  },
  {
    projectName: 'Optimizacion de procesos',
    name: 'Mapeo de procesos',
    description: 'Documentar flujos actuales de procesos.',
    status: 'cancelled',
  },
  {
    projectName: 'Optimizacion de procesos',
    name: 'Propuesta de optimizacion',
    description: 'Proponer recomendaciones de optimizacion.',
    status: 'cancelled',
  },
  {
    projectName: 'Despliegue de campus digital',
    name: 'Lanzamiento piloto',
    description: 'Lanzar servicios piloto en un campus.',
    status: 'in_progress',
  },
  {
    projectName: 'Despliegue de campus digital',
    name: 'Consolidacion de feedback',
    description: 'Consolidar feedback del piloto para la siguiente iteracion.',
    status: 'pending',
  },
]

export async function seedProjects(
  db: Db,
  adminUserId: number,
  userOperativeId: number,
  programId: number,
) {
  const projects = await db
    .insert(Project)
    .values(
      projectSeeds.map((project) => ({
        ...project,
        createdBy: adminUserId,
        responsibleId: userOperativeId,
        programId,
        uid: nanoid(),
      })),
    )
    .returning()

  const projectByName = new Map(projects.map((project) => [project.name, project.id]))

  const tasks = taskSeeds
    .map((task) => {
      const projectId = projectByName.get(task.projectName)
      if (!projectId) {
        return null
      }
      return {
        name: task.name,
        description: task.description,
        status: task.status,
        projectId,
        createdBy: adminUserId,
        responsibleId: userOperativeId,
        uid: nanoid(),
      }
    })
    .filter(Boolean) as Array<{
    name: string
    description: string
    status: 'pending' | 'in_progress' | 'reviewing' | 'done' | 'cancelled'
    projectId: number
    createdBy: number
    responsibleId: number
    uid: string
  }>

  if (tasks.length) {
    await db.insert(ProjectTask).values(tasks)
  }
}
