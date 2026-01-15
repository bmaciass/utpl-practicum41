import { Entity, ValidationError } from '@sigep/shared'

export interface CreateObjectivePNDProps {
  name: string
  description: string
  createdBy: number
}

export interface ObjectivePNDProps {
  id: number
  uid: string
  name: string
  description: string
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy?: number
  updatedAt?: Date
}

export class ObjectivePND extends Entity {
  private _id: number
  private _name: string
  private _description: string
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId?: number

  private constructor(props: ObjectivePNDProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this._updatedByUserId = props.updatedBy
    if (props.updatedAt) {
      this.updatedAt = props.updatedAt
    }
  }

  static create(props: CreateObjectivePNDProps): ObjectivePND {
    ObjectivePND.validateName(props.name)
    ObjectivePND.validateDescription(props.description)

    return new ObjectivePND({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name,
      description: props.description,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
    })
  }

  static reconstitute(props: ObjectivePNDProps): ObjectivePND {
    return new ObjectivePND(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre del objetivo PND debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  private static validateDescription(description: string): void {
    if (!description || description.trim().length < 10) {
      throw new ValidationError(
        'La descripción del objetivo PND debe tener al menos 10 caracteres',
        'description',
      )
    }
  }

  updateName(name: string, updatedBy: number): void {
    ObjectivePND.validateName(name)
    this._name = name
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateDescription(description: string, updatedBy: number): void {
    ObjectivePND.validateDescription(description)
    this._description = description
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
  get description(): string {
    return this._description
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
  get updatedByUserId(): number | undefined {
    return this._updatedByUserId
  }
  get isNew(): boolean {
    return this._id === 0
  }
}
