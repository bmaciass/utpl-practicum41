import { Entity, ValidationError } from '@sigep/shared'

export interface CreateInstitutionalObjectiveProps {
  name: string
  description: string
  institutionId: number
  createdBy: number
}

export interface InstitutionalObjectiveProps {
  id: number
  uid: string
  name: string
  description: string
  institutionId: number
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy?: number
  updatedAt?: Date
}

export class InstitutionalObjective extends Entity {
  private _id: number
  private _name: string
  private _description: string
  private _institutionId: number
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId?: number

  private constructor(props: InstitutionalObjectiveProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._institutionId = props.institutionId
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this._updatedByUserId = props.updatedBy
    if (props.updatedAt) {
      this.updatedAt = props.updatedAt
    }
  }

  static create(
    props: CreateInstitutionalObjectiveProps,
  ): InstitutionalObjective {
    InstitutionalObjective.validateName(props.name)
    if (props.description !== undefined) {
      InstitutionalObjective.validateDescription(props.description)
    }

    return new InstitutionalObjective({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name,
      description: props.description ?? null,
      institutionId: props.institutionId,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
    })
  }

  static reconstitute(
    props: InstitutionalObjectiveProps,
  ): InstitutionalObjective {
    return new InstitutionalObjective(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre del objetivo debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  private static validateDescription(description: string): void {
    if (description && description.trim().length < 10) {
      throw new ValidationError(
        'La descripción debe tener al menos 10 caracteres',
        'description',
      )
    }
  }

  updateName(name: string, updatedBy: number): void {
    InstitutionalObjective.validateName(name)
    this._name = name
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateDescription(description: string, updatedBy: number): void {
    InstitutionalObjective.validateDescription(description)
    this._description = description
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateInstitution(institutionId: number, updatedBy: number): void {
    this._institutionId = institutionId
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
  get institutionId(): number {
    return this._institutionId
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
