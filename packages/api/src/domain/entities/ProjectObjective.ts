import { Entity, ValidationError } from '@sigep/shared'

export type ProjectObjectiveStatus =
  | 'pending'
  | 'in_progress'
  | 'reviewing'
  | 'done'
  | 'cancelled'

export interface CreateProjectObjectiveProps {
  name: string
  status?: ProjectObjectiveStatus
  projectId: number
  createdBy: number
}

export interface ProjectObjectiveProps {
  id: number
  uid: string
  name: string
  status: ProjectObjectiveStatus
  projectId: number
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy?: number | null
  updatedAt?: Date | null
}

export class ProjectObjective extends Entity {
  private _id: number
  private _name: string
  private _status: ProjectObjectiveStatus
  private _projectId: number
  private _deletedAt: Date | null

  private constructor(props: ProjectObjectiveProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._status = props.status
    this._projectId = props.projectId
    this._deletedAt = props.deletedAt
    this.updatedAt = props.updatedAt ?? null
    this.updatedBy = props.updatedBy ?? null
  }

  static create(props: CreateProjectObjectiveProps): ProjectObjective {
    ProjectObjective.validateName(props.name)
    ProjectObjective.validateProjectId(props.projectId)

    return new ProjectObjective({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name.trim(),
      status: props.status ?? 'pending',
      projectId: props.projectId,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedAt: null,
      updatedBy: null,
    })
  }

  static reconstitute(props: ProjectObjectiveProps): ProjectObjective {
    return new ProjectObjective(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre del objetivo debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  private static validateProjectId(projectId: number): void {
    if (!projectId || projectId <= 0) {
      throw new ValidationError('El proyecto es requerido', 'projectId')
    }
  }

  updateName(name: string, updatedBy: number): void {
    ProjectObjective.validateName(name)
    this._name = name.trim()
    this.markUpdated(updatedBy)
  }

  updateStatus(status: ProjectObjectiveStatus, updatedBy: number): void {
    this._status = status
    this.markUpdated(updatedBy)
  }

  deactivate(updatedBy: number): void {
    this._deletedAt = new Date()
    this.markUpdated(updatedBy)
  }

  activate(updatedBy: number): void {
    this._deletedAt = null
    this.markUpdated(updatedBy)
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get status(): ProjectObjectiveStatus {
    return this._status
  }

  get projectId(): number {
    return this._projectId
  }

  get deletedAt(): Date | null {
    return this._deletedAt
  }

  get active(): boolean {
    return this._deletedAt === null
  }

  get createdByUserId(): number {
    return this.createdBy
  }

  get updatedByUserId(): number | null {
    return this.updatedBy
  }

  get isNew(): boolean {
    return this._id === 0
  }
}
