import { Entity, ValidationError } from '@sigep/shared'

export interface CreateObjectiveODSProps {
  name: string
  description: string
  createdBy: number
}

export interface ObjectiveODSProps {
  id: number
  uid: string
  name: string
  description: string
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy: number | null
  updatedAt: Date | null
}

export class ObjectiveODS extends Entity {
  private _id: number
  private _name: string
  private _description: string
  private _deletedAt: Date | null

  private constructor(props: ObjectiveODSProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._deletedAt = props.deletedAt
  }

  static create(props: CreateObjectiveODSProps): ObjectiveODS {
    ObjectiveODS.validateName(props.name)
    ObjectiveODS.validateDescription(props.description)

    return new ObjectiveODS({
      id: 0,
      uid: '',
      name: props.name,
      description: props.description,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
    })
  }

  static reconstitute(props: ObjectiveODSProps): ObjectiveODS {
    return new ObjectiveODS(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'ObjectiveODS name must be at least 3 characters',
      )
    }
  }

  private static validateDescription(description: string): void {
    if (!description || description.trim().length < 10) {
      throw new ValidationError(
        'ObjectiveODS description must be at least 10 characters',
      )
    }
  }

  get id(): number {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get description(): string {
    return this._description
  }
  get deletedAt(): Date | null {
    return this._deletedAt
  }
  get active(): boolean {
    return this._deletedAt === null
  }
}
