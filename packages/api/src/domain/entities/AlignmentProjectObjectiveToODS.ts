import { ValidationError } from '@sigep/shared'

interface AlignmentProjectObjectiveToODSProps {
  id: number
  projectObjectiveId: number
  odsObjectiveId: number
  createdByUserId: number
  createdAt: Date
  updatedByUserId?: number | null
  updatedAt?: Date | null
}

interface CreateAlignmentProjectObjectiveToODSProps {
  projectObjectiveId: number
  odsObjectiveId: number
  createdBy: number
}

export class AlignmentProjectObjectiveToODS {
  private _id: number
  private _projectObjectiveId: number
  private _odsObjectiveId: number
  private _createdByUserId: number
  private _createdAt: Date
  private _updatedByUserId?: number | null
  private _updatedAt?: Date | null

  private constructor(props: AlignmentProjectObjectiveToODSProps) {
    this._id = props.id
    this._projectObjectiveId = props.projectObjectiveId
    this._odsObjectiveId = props.odsObjectiveId
    this._createdByUserId = props.createdByUserId
    this._createdAt = props.createdAt
    this._updatedByUserId = props.updatedByUserId
    this._updatedAt = props.updatedAt
  }

  static create(
    props: CreateAlignmentProjectObjectiveToODSProps,
  ): AlignmentProjectObjectiveToODS {
    AlignmentProjectObjectiveToODS.validate(props)

    return new AlignmentProjectObjectiveToODS({
      id: 0,
      projectObjectiveId: props.projectObjectiveId,
      odsObjectiveId: props.odsObjectiveId,
      createdByUserId: props.createdBy,
      createdAt: new Date(),
    })
  }

  static reconstitute(
    props: AlignmentProjectObjectiveToODSProps,
  ): AlignmentProjectObjectiveToODS {
    return new AlignmentProjectObjectiveToODS(props)
  }

  private static validate(
    props: CreateAlignmentProjectObjectiveToODSProps,
  ): void {
    if (!props.projectObjectiveId || props.projectObjectiveId <= 0) {
      throw new ValidationError(
        'ID de objetivo de proyecto inválido',
        'projectObjectiveId',
      )
    }
    if (!props.odsObjectiveId || props.odsObjectiveId <= 0) {
      throw new ValidationError('ID de objetivo ODS inválido', 'odsObjectiveId')
    }
    if (!props.createdBy || props.createdBy <= 0) {
      throw new ValidationError('ID de usuario inválido', 'createdBy')
    }
  }

  get id(): number {
    return this._id
  }

  get projectObjectiveId(): number {
    return this._projectObjectiveId
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
