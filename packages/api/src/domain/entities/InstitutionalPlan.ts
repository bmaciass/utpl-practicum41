import { Entity, ValidationError } from '@sigep/shared'

export interface CreateInstitutionalPlanProps {
  name: string
  description: string
  year: number
  url?: string | null
  institutionId: number
  createdBy: number
}

export interface InstitutionalPlanProps {
  id: number
  uid: string
  name: string
  description: string
  year: number
  url: string | null
  institutionId: number
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy?: number
  updatedAt?: Date
}

export class InstitutionalPlan extends Entity {
  private _id: number
  private _name: string
  private _description: string
  private _year: number
  private _url: string | null
  private _institutionId: number
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId?: number

  private constructor(props: InstitutionalPlanProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._year = props.year
    this._url = props.url
    this._institutionId = props.institutionId
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this._updatedByUserId = props.updatedBy
    if (props.updatedAt) {
      this.updatedAt = props.updatedAt
    }
  }

  static create(props: CreateInstitutionalPlanProps): InstitutionalPlan {
    InstitutionalPlan.validateName(props.name)
    InstitutionalPlan.validateYear(props.year)

    return new InstitutionalPlan({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name,
      description: props.description,
      year: props.year,
      url: props.url ?? null,
      institutionId: props.institutionId,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
    })
  }

  static reconstitute(props: InstitutionalPlanProps): InstitutionalPlan {
    return new InstitutionalPlan(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre del plan debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  private static validateYear(year: number): void {
    if (year < 2000 || year > 2100) {
      throw new ValidationError('El año debe estar entre 2000 y 2100', 'year')
    }
  }

  updateName(name: string, updatedBy: number): void {
    InstitutionalPlan.validateName(name)
    this._name = name
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateYear(year: number, updatedBy: number): void {
    InstitutionalPlan.validateYear(year)
    this._year = year
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateDescription(description: string, updatedBy: number): void {
    this._description = description
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateUrl(url: string | null, updatedBy: number): void {
    this._url = url
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
  get year(): number {
    return this._year
  }
  get url(): string | null {
    return this._url
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
