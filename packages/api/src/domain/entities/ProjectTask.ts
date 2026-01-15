import { Entity, ValidationError } from '@sigep/shared'
import { isUndefined } from 'lodash-es'

export type ProjectTaskStatus =
  | 'pending'
  | 'in_progress'
  | 'reviewing'
  | 'done'
  | 'cancelled'

export interface CreateProjectTaskProps {
  name: string
  description: string | null
  projectId: number
  responsibleId: number
  status?: ProjectTaskStatus
  startDate?: Date | null
  endDate?: Date | null
  createdBy: number
}

export interface ProjectTaskProps {
  id: number
  uid: string
  name: string
  description: string | null
  projectId: number
  responsibleId: number
  status: ProjectTaskStatus
  startDate: Date | null
  endDate: Date | null
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy?: number
  updatedAt: Date | null
}

export class ProjectTask extends Entity {
  private _id: number
  private _name: string
  private _description: string | null
  private _projectId: number
  private _status: ProjectTaskStatus
  private _startDate: Date | null
  private _endDate: Date | null
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _responsibleId: number

  private constructor(props: ProjectTaskProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._projectId = props.projectId
    this._responsibleId = props.responsibleId
    this._status = props.status
    this._startDate = props.startDate
    this._endDate = props.endDate
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this.updatedAt = props.updatedAt
  }

  static create(props: CreateProjectTaskProps): ProjectTask {
    ProjectTask.validateName(props.name)

    return new ProjectTask({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name,
      description: props.description,
      projectId: props.projectId,
      responsibleId: props.responsibleId,
      status: props.status ?? 'pending',
      startDate: props.startDate ?? null,
      endDate: props.endDate ?? null,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedAt: null,
    })
  }

  static reconstitute(props: ProjectTaskProps): ProjectTask {
    return new ProjectTask(props)
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
    ProjectTask.validateName(name)
    this._name = name
    this.markUpdated(updatedBy)
  }

  updateStatus(status: ProjectTaskStatus, updatedBy: number): void {
    this._status = status
    this.markUpdated(updatedBy)
  }

  updateDescription(description: string | null, updatedBy: number) {
    this._description = description
    this.markUpdated(updatedBy)
  }

  updateResponsibleId(id: number, updatedBy: number) {
    this._responsibleId = id
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
  get description() {
    return this._description
  }
  get projectId(): number {
    return this._projectId
  }
  get responsibleId() {
    return this._responsibleId
  }
  get status(): ProjectTaskStatus {
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
    return this.updatedBy
  }
  get isNew(): boolean {
    return this._id === 0
  }
}
