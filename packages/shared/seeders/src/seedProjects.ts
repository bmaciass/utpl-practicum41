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
    name: 'Data platform refresh',
    description: 'Refresh core data pipelines and reporting foundations.',
    status: 'in_progress',
  },
  {
    name: 'Student tracking system',
    description: 'Centralize student progress tracking and alerts.',
    status: 'done',
  },
  {
    name: 'Service desk modernization',
    description: 'Improve service desk tooling and response workflows.',
    status: 'pending',
  },
  {
    name: 'Process optimization',
    description: 'Streamline internal process handoffs and approvals.',
    status: 'cancelled',
  },
  {
    name: 'Digital campus rollout',
    description: 'Enable digital services for campus operations.',
    status: 'in_progress',
  },
]

const taskSeeds: TaskSeed[] = [
  {
    projectName: 'Data platform refresh',
    name: 'Source inventory',
    description: 'Identify data sources and assess data quality.',
    status: 'in_progress',
  },
  {
    projectName: 'Data platform refresh',
    name: 'Normalization plan',
    description: 'Define schema changes and normalization rules.',
    status: 'reviewing',
  },
  {
    projectName: 'Data platform refresh',
    name: 'Pipeline refactor',
    description: 'Refactor pipelines for monitoring and resilience.',
    status: 'pending',
  },
  {
    projectName: 'Student tracking system',
    name: 'Legacy migration',
    description: 'Migrate legacy records into the new system.',
    status: 'done',
  },
  {
    projectName: 'Student tracking system',
    name: 'Staff training',
    description: 'Train academic staff on the new dashboards.',
    status: 'done',
  },
  {
    projectName: 'Service desk modernization',
    name: 'Requirements discovery',
    description: 'Collect requirements from support teams.',
    status: 'pending',
  },
  {
    projectName: 'Service desk modernization',
    name: 'Tool shortlist',
    description: 'Evaluate vendors and shortlist options.',
    status: 'pending',
  },
  {
    projectName: 'Process optimization',
    name: 'Process mapping',
    description: 'Document current process flows.',
    status: 'cancelled',
  },
  {
    projectName: 'Process optimization',
    name: 'Optimization proposal',
    description: 'Draft optimization recommendations.',
    status: 'cancelled',
  },
  {
    projectName: 'Digital campus rollout',
    name: 'Pilot launch',
    description: 'Launch pilot services for one campus.',
    status: 'in_progress',
  },
  {
    projectName: 'Digital campus rollout',
    name: 'Feedback consolidation',
    description: 'Consolidate pilot feedback for next iteration.',
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
