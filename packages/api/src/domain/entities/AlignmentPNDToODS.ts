import { ValidationError } from '@sigep/shared'

interface AlignmentPNDToODSProps {
  id: number
  pndObjectiveId: number
  odsObjectiveId: number
  createdByUserId: number
  createdAt: Date
  updatedByUserId?: number | null
  updatedAt?: Date | null
}

interface CreateAlignmentPNDToODSProps {
  pndObjectiveId: number
  odsObjectiveId: number
  createdBy: number
}

export class AlignmentPNDToODS {
  private _id: number
  private _pndObjectiveId: number
  private _odsObjectiveId: number
  private _createdByUserId: number
  private _createdAt: Date
  private _updatedByUserId?: number | null
  private _updatedAt?: Date | null

  private constructor(props: AlignmentPNDToODSProps) {
    this._id = props.id
    this._pndObjectiveId = props.pndObjectiveId
    this._odsObjectiveId = props.odsObjectiveId
    this._createdByUserId = props.createdByUserId
    this._createdAt = props.createdAt
    this._updatedByUserId = props.updatedByUserId
    this._updatedAt = props.updatedAt
  }

  // Factory method for creating new alignments
  static create(props: CreateAlignmentPNDToODSProps): AlignmentPNDToODS {
    AlignmentPNDToODS.validate(props)

    return new AlignmentPNDToODS({
      id: 0, // Will be set by database
      pndObjectiveId: props.pndObjectiveId,
      odsObjectiveId: props.odsObjectiveId,
      createdByUserId: props.createdBy,
      createdAt: new Date(),
    })
  }

  // Factory method for reconstituting from database
  static reconstitute(props: AlignmentPNDToODSProps): AlignmentPNDToODS {
    return new AlignmentPNDToODS(props)
  }

  private static validate(props: CreateAlignmentPNDToODSProps): void {
    if (!props.pndObjectiveId || props.pndObjectiveId <= 0) {
      throw new ValidationError('ID de objetivo PND inválido', 'pndObjectiveId')
    }
    if (!props.odsObjectiveId || props.odsObjectiveId <= 0) {
      throw new ValidationError('ID de objetivo ODS inválido', 'odsObjectiveId')
    }
    if (!props.createdBy || props.createdBy <= 0) {
      throw new ValidationError('ID de usuario inválido', 'createdBy')
    }
  }

  // Getters
  get id(): number {
    return this._id
  }

  get pndObjectiveId(): number {
    return this._pndObjectiveId
  }

  get odsObjectiveId(): number {
    return this._odsObjectiveId
  }

  get createdByUserId(): number {
    return this._createdByUserId
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedByUserId(): number | null | undefined {
    return this._updatedByUserId
  }

  get updatedAt(): Date | null | undefined {
    return this._updatedAt
  }

  get isNew(): boolean {
    return this._id === 0
  }
}
