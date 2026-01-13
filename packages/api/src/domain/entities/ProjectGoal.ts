import { Entity, ValidationError } from '@sigep/shared'
import { isUndefined } from 'lodash-es'

export type ProjectGoalStatus =
  | 'pending'
  | 'in_progress'
  | 'reviewing'
  | 'done'
  | 'cancelled'

export interface CreateProjectGoalProps {
  name: string
  projectId: number
  status?: ProjectGoalStatus
  startDate?: Date | null
  endDate?: Date | null
  createdBy: number
}

export interface ProjectGoalProps {
  id: number
  uid: string
  name: string
  projectId: number
  status: ProjectGoalStatus
  startDate: Date | null
  endDate: Date | null
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy?: number
  updatedAt: Date | null
}

export class ProjectGoal extends Entity {
  private _id: number
  private _name: string
  private _projectId: number
  private _status: ProjectGoalStatus
  private _startDate: Date | null
  private _endDate: Date | null
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId: number | null

  private constructor(props: ProjectGoalProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._projectId = props.projectId
    this._status = props.status
    this._startDate = props.startDate
    this._endDate = props.endDate
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this._updatedByUserId = props.updatedBy ?? null
    this.updatedAt = props.updatedAt
  }

  static create(props: CreateProjectGoalProps): ProjectGoal {
    ProjectGoal.validateName(props.name)

    return new ProjectGoal({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name,
      projectId: props.projectId,
      status: props.status ?? 'pending',
      startDate: props.startDate ?? null,
      endDate: props.endDate ?? null,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedAt: null,
    })
  }

  static reconstitute(props: ProjectGoalProps): ProjectGoal {
    return new ProjectGoal(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre del objetivo debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  updateName(name: string, updatedBy: number): void {
    ProjectGoal.validateName(name)
    this._name = name
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateStatus(status: ProjectGoalStatus, updatedBy: number): void {
    this._status = status
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateDates(
    data: { startDate: Date | undefined; endDate: Date | undefined },
    updatedBy: number,
  ): void {
    const { endDate, startDate } = data
    if (!isUndefined(endDate)) {
      this._endDate = endDate
    }

    if (!isUndefined(startDate)) {
      this._startDate = startDate
    }

    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  deactivate(updatedBy: number): void {
    this._deletedAt = new Date()
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  activate(updatedBy: number): void {
    this._deletedAt = null
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  get id(): number {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get projectId(): number {
    return this._projectId
  }
  get status(): ProjectGoalStatus {
    return this._status
  }
  get startDate(): Date | null {
    return this._startDate
  }
  get endDate(): Date | null {
    return this._endDate
  }
  get active(): boolean {
    return this._deletedAt === null
  }
  get deletedAt(): Date | null {
    return this._deletedAt
  }
  get createdByUserId(): number {
    return this._createdByUserId
  }
  get updatedByUserId(): number | null {
    return this._updatedByUserId
  }
  get isNew(): boolean {
    return this._id === 0
  }
}
