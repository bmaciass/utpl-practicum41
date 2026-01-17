import { Entity, ValidationError } from '@sigep/shared'
import { isUndefined } from 'lodash-es'

export type IndicatorType = 'number' | 'percentage'

export interface CreateIndicatorProps {
  name: string
  description?: string | null
  type?: IndicatorType | null
  unitType?: string | null
  minValue?: number | null
  maxValue?: number | null
  goalId: number
  createdBy: number
}

export interface IndicatorProps {
  id: number
  uid: string
  name: string
  description: string | null
  type: IndicatorType | null
  unitType: string | null
  minValue: number | null
  maxValue: number | null
  goalId: number
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy: number | null
  updatedAt: Date | null
}

export class Indicator extends Entity {
  private _id: number
  private _name: string
  private _description: string | null
  private _type: IndicatorType | null
  private _unitType: string | null
  private _minValue: number | null
  private _maxValue: number | null
  private _goalId: number
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId: number | null

  private constructor(props: IndicatorProps) {
    super(props.uid, props.createdBy, props.createdAt)
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._type = props.type
    this._unitType = props.unitType
    this._minValue = props.minValue
    this._maxValue = props.maxValue
    this._goalId = props.goalId
    this._deletedAt = props.deletedAt
    this._createdByUserId = props.createdBy
    this._updatedByUserId = props.updatedBy
    this.updatedAt = props.updatedAt
  }

  static create(props: CreateIndicatorProps): Indicator {
    Indicator.validateName(props.name)
    Indicator.validateDescription(props.description ?? null)
    Indicator.validateRange(props.minValue ?? null, props.maxValue ?? null)

    if (!props.goalId) {
      throw new ValidationError('Goal is required', 'goalId')
    }

    return new Indicator({
      id: 0,
      uid: crypto.randomUUID(),
      name: props.name.trim(),
      description: props.description ?? null,
      type: props.type ?? null,
      unitType: props.unitType ?? null,
      minValue: props.minValue ?? null,
      maxValue: props.maxValue ?? null,
      goalId: props.goalId,
      deletedAt: null,
      createdBy: props.createdBy,
      createdAt: new Date(),
      updatedAt: null,
      updatedBy: null,
    })
  }

  static reconstitute(props: IndicatorProps): Indicator {
    return new Indicator(props)
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'Indicator name must be at least 3 characters long',
        'name',
      )
    }
  }

  private static validateDescription(description: string | null): void {
    if (description && description.trim().length < 10) {
      throw new ValidationError(
        'Indicator description must be at least 10 characters long',
        'description',
      )
    }
  }

  private static validateRange(
    minValue: number | null,
    maxValue: number | null,
  ): void {
    if (minValue !== null && maxValue !== null && minValue > maxValue) {
      throw new ValidationError(
        'Indicator min value cannot be greater than max value',
        'minValue',
      )
    }
  }

  updateName(name: string, updatedBy: number): void {
    Indicator.validateName(name)
    this._name = name.trim()
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateDescription(description: string | null, updatedBy: number): void {
    Indicator.validateDescription(description)
    this._description = description
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateType(type: IndicatorType | null, updatedBy: number): void {
    this._type = type
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateUnitType(unitType: string | null, updatedBy: number): void {
    this._unitType = unitType
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateRange(
    data: { minValue?: number | null; maxValue?: number | null },
    updatedBy: number,
  ): void {
    const minValue = isUndefined(data.minValue) ? this._minValue : data.minValue
    const maxValue = isUndefined(data.maxValue) ? this._maxValue : data.maxValue

    Indicator.validateRange(minValue, maxValue)

    this._minValue = minValue
    this._maxValue = maxValue
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateGoal(goalId: number, updatedBy: number): void {
    if (!goalId) {
      throw new ValidationError('Goal is required', 'goalId')
    }
    this._goalId = goalId
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
  get description(): string | null {
    return this._description
  }
  get type(): IndicatorType | null {
    return this._type
  }
  get unitType(): string | null {
    return this._unitType
  }
  get minValue(): number | null {
    return this._minValue
  }
  get maxValue(): number | null {
    return this._maxValue
  }
  get goalId(): number {
    return this._goalId
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
