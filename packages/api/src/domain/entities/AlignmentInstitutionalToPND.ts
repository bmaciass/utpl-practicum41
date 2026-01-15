import { ValidationError } from '@sigep/shared'

interface AlignmentInstitutionalToPNDProps {
  id: number
  institutionalObjectiveId: number
  pndObjectiveId: number
  createdByUserId: number
  createdAt: Date
  updatedByUserId?: number | null
  updatedAt?: Date | null
}

interface CreateAlignmentInstitutionalToPNDProps {
  institutionalObjectiveId: number
  pndObjectiveId: number
  createdBy: number
}

export class AlignmentInstitutionalToPND {
  private _id: number
  private _institutionalObjectiveId: number
  private _pndObjectiveId: number
  private _createdByUserId: number
  private _createdAt: Date
  private _updatedByUserId?: number | null
  private _updatedAt?: Date | null

  private constructor(props: AlignmentInstitutionalToPNDProps) {
    this._id = props.id
    this._institutionalObjectiveId = props.institutionalObjectiveId
    this._pndObjectiveId = props.pndObjectiveId
    this._createdByUserId = props.createdByUserId
    this._createdAt = props.createdAt
    this._updatedByUserId = props.updatedByUserId
    this._updatedAt = props.updatedAt
  }

  // Factory method for creating new alignments
  static create(
    props: CreateAlignmentInstitutionalToPNDProps,
  ): AlignmentInstitutionalToPND {
    AlignmentInstitutionalToPND.validate(props)

    return new AlignmentInstitutionalToPND({
      id: 0, // Will be set by database
      institutionalObjectiveId: props.institutionalObjectiveId,
      pndObjectiveId: props.pndObjectiveId,
      createdByUserId: props.createdBy,
      createdAt: new Date(),
    })
  }

  // Factory method for reconstituting from database
  static reconstitute(
    props: AlignmentInstitutionalToPNDProps,
  ): AlignmentInstitutionalToPND {
    return new AlignmentInstitutionalToPND(props)
  }

  private static validate(props: CreateAlignmentInstitutionalToPNDProps): void {
    if (
      !props.institutionalObjectiveId ||
      props.institutionalObjectiveId <= 0
    ) {
      throw new ValidationError(
        'ID de objetivo institucional inválido',
        'institutionalObjectiveId',
      )
    }
    if (!props.pndObjectiveId || props.pndObjectiveId <= 0) {
      throw new ValidationError('ID de objetivo PND inválido', 'pndObjectiveId')
    }
    if (!props.createdBy || props.createdBy <= 0) {
      throw new ValidationError('ID de usuario inválido', 'createdBy')
    }
  }

  // Getters
  get id(): number {
    return this._id
  }

  get institutionalObjectiveId(): number {
    return this._institutionalObjectiveId
  }

  get pndObjectiveId(): number {
    return this._pndObjectiveId
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
