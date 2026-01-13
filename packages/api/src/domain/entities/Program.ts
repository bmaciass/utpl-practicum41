import { Entity, ValidationError } from '@sigep/shared'
import { isUndefined } from 'lodash-es'

export interface CreateProgramProps {
  name: string
  description?: string | null
  startDate?: Date | null
  endDate?: Date | null
  responsibleId: number
  createdBy: number
}

export interface ProgramProps {
  id: number
  uid: string
  name: string
  description: string | null
  startDate: Date | null
  endDate: Date | null
  responsibleId: number
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy: number | null
  updatedAt: Date | null
}

export class Program extends Entity {
  private _id: number
  private _name: string
  private _description: string | null = null
  private _startDate: Date | null = null
  private _endDate: Date | null = null
  private _responsibleId: number
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId: number | null = null

  private constructor(props: ProgramProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._startDate = props.startDate
    this._endDate = props.endDate
    this._responsibleId = props.responsibleId
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this._updatedByUserId = props.updatedBy
    this.updatedAt = props.updatedAt
  }

  static create(props: CreateProgramProps): Program {
    Program.validateName(props.name)

    return new Program({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name,
      description: props.description ?? null,
      startDate: props.startDate ?? null,
      endDate: props.endDate ?? null,
      responsibleId: props.responsibleId,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedAt: null,
      updatedBy: null,
    })
  }

  static reconstitute(props: ProgramProps): Program {
    return new Program(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre del programa debe tener al menos 3 caracteres',
        'name',
      )
    }
  }

  updateName(name: string, updatedBy: number): void {
    Program.validateName(name)
    this._name = name
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateDescription(data: {
    description?: string | null
    updatedBy: number
  }): void {
    const { description, updatedBy } = data
    if (!isUndefined(description)) {
      this._description = description
    }
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

  updateResponsible(responsibleId: number, updatedBy: number): void {
    this._responsibleId = responsibleId
    this._updatedByUserId = updatedBy
    this.updatedAt = new Date()
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
  get description(): string | null {
    return this._description
  }
  get startDate(): Date | null {
    return this._startDate
  }
  get endDate(): Date | null {
    return this._endDate
  }
  get responsibleId(): number {
    return this._responsibleId
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
