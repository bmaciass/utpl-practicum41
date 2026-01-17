import { Entity, ValidationError } from '@sigep/shared'

export interface GoalProps {
  id: number
  uid: string
  name: string
  description: string
  institutionalObjectiveId: number
  createdBy: number
  createdAt: Date
  updatedBy: number | null
  updatedAt: Date | null
  deletedAt: Date | null
}

export interface CreateGoalProps {
  name: string
  description: string
  institutionalObjectiveId: number
  createdBy: number
}

export class Goal extends Entity {
  private _id: number
  private _name: string
  private _description: string
  private _institutionalObjectiveId: number
  private _deletedAt: Date | null

  private constructor(props: GoalProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._institutionalObjectiveId = props.institutionalObjectiveId
    this._deletedAt = props.deletedAt
    this.updatedAt = props.updatedAt
    this.updatedBy = props.updatedBy
  }

  static create(props: CreateGoalProps): Goal {
    // Validation
    if (!props.name || props.name.trim().length < 3) {
      throw new ValidationError('Goal name must be at least 3 characters long')
    }

    if (!props.description || props.description.trim().length < 10) {
      throw new ValidationError(
        'Goal description must be at least 10 characters long',
      )
    }

    if (!props.institutionalObjectiveId) {
      throw new ValidationError('Institutional objective ID is required')
    }

    return new Goal({
      id: 0, // Will be set by database
      uid: crypto.randomUUID(),
      name: props.name.trim(),
      description: props.description.trim(),
      institutionalObjectiveId: props.institutionalObjectiveId,
      createdBy: props.createdBy,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
      updatedBy: null,
    })
  }

  static reconstitute(props: GoalProps): Goal {
    return new Goal(props)
  }

  updateName(name: string, updatedBy: number): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError('Goal name must be at least 3 characters long')
    }

    this._name = name.trim()
    this.markUpdated(updatedBy)
  }

  updateDescription(description: string, updatedBy: number): void {
    if (!description || description.trim().length < 10) {
      throw new ValidationError(
        'Goal description must be at least 10 characters long',
      )
    }

    this._description = description.trim()
    this.markUpdated(updatedBy)
  }

  updateInstitutionalObjective(
    institutionalObjectiveId: number,
    updatedBy: number,
  ): void {
    if (!institutionalObjectiveId) {
      throw new ValidationError('Institutional objective ID is required')
    }

    this._institutionalObjectiveId = institutionalObjectiveId
    this.markUpdated(updatedBy)
  }

  deactivate(updatedBy: number): void {
    if (this._deletedAt !== null) {
      throw new ValidationError('Goal is already deactivated')
    }

    this._deletedAt = new Date()
    this.markUpdated(updatedBy)
  }

  // Getters

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get institutionalObjectiveId(): number {
    return this._institutionalObjectiveId
  }

  get deletedAt(): Date | null {
    return this._deletedAt
  }

  get active(): boolean {
    return this._deletedAt === null
  }

  setId(id: number): void {
    if (this._id === 0) {
      this._id = id
    }
  }
}
