import { Entity, ValidationError } from '@sigep/shared'

/**
 * Tipos de área institucional.
 */
export type InstitutionArea = 'educacion'

/**
 * Niveles de gobernanza institucional.
 */
export type InstitutionLevel = 'nacional'

/**
 * Propiedades para crear una nueva institución.
 */
export interface CreateInstitutionProps {
  name: string
  area: InstitutionArea
  level: InstitutionLevel
  createdBy: number
}

/**
 * Propiedades completas de una institución (para reconstituir desde BD).
 */
export interface InstitutionProps {
  id: number
  uid: string
  name: string
  area: InstitutionArea
  level: InstitutionLevel
  deletedAt: Date | null
  createdBy: number
  createdAt: Date
  updatedBy: number | null
  updatedAt: Date | null
}

/**
 * Entidad de dominio que representa una Institución.
 * Contiene la lógica de negocio relacionada con instituciones.
 */
export class Institution extends Entity {
  private _id: number
  private _name: string
  private _area: InstitutionArea
  private _level: InstitutionLevel
  private _deletedAt: Date | null
  private _createdByUserId: number
  private _updatedByUserId: number | null

  private constructor(
    id: number,
    uid: string,
    name: string,
    area: InstitutionArea,
    level: InstitutionLevel,
    deletedAt: Date | null,
    createdBy: number,
    createdAt: Date,
    updatedBy: number | null,
    updatedAt: Date | null,
  ) {
    super(uid, createdBy, createdAt)
    this._id = id
    this._name = name
    this._area = area
    this._level = level
    this._deletedAt = deletedAt
    this._createdByUserId = createdBy
    this._updatedByUserId = updatedBy
    this.updatedAt = updatedAt
    this.updatedBy = updatedBy
  }

  /**
   * Crea una nueva institución.
   * El ID se asignará al persistir, uid se genera automáticamente.
   */
  static create(props: CreateInstitutionProps): Institution {
    Institution.validateName(props.name)

    return new Institution(
      0, // ID temporal, se asigna al persistir
      crypto.randomUUID(),
      props.name,
      props.area,
      props.level,
      null, // deletedAt is null for active records
      props.createdBy,
      new Date(),
      null,
      null,
    )
  }

  /**
   * Reconstituye una institución desde la base de datos.
   */
  static reconstitute(props: InstitutionProps): Institution {
    return new Institution(
      props.id,
      props.uid,
      props.name,
      props.area,
      props.level,
      props.deletedAt,
      props.createdBy,
      props.createdAt,
      props.updatedBy,
      props.updatedAt,
    )
  }

  // Validaciones de dominio
  private static validateName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new ValidationError(
        'El nombre de la institución debe tener al menos 3 caracteres',
        'name',
      )
    }
    if (name.length > 128) {
      throw new ValidationError(
        'El nombre de la institución no puede exceder 128 caracteres',
        'name',
      )
    }
  }

  // Comportamiento de dominio
  updateName(name: string, updatedBy: number): void {
    Institution.validateName(name)
    this._name = name
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateArea(area: InstitutionArea, updatedBy: number): void {
    this._area = area
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  updateLevel(level: InstitutionLevel, updatedBy: number): void {
    this._level = level
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  deactivate(updatedBy: number): void {
    if (this._deletedAt !== null) {
      throw new ValidationError('La institución ya está desactivada')
    }
    this._deletedAt = new Date()
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  activate(updatedBy: number): void {
    if (this._deletedAt === null) {
      throw new ValidationError('La institución ya está activa')
    }
    this._deletedAt = null
    this._updatedByUserId = updatedBy
    this.markUpdated(updatedBy)
  }

  // Getters
  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get area(): InstitutionArea {
    return this._area
  }

  get level(): InstitutionLevel {
    return this._level
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

  /**
   * Verifica si la institución es nueva (aún no persistida).
   */
  get isNew(): boolean {
    return this._id === 0
  }
}
