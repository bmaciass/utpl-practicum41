/**
 * Clase base abstracta para todas las entidades del dominio.
 * Proporciona identificación única, timestamps y tracking de cambios.
 */
export abstract class Entity {
  private _updatedBy: number | null = null
  private _updatedAt: Date | null = null

  protected constructor(
    private readonly _uid: string,
    private readonly _createdBy: number,
    private readonly _createdAt: Date,
  ) {}

  get uid(): string {
    return this._uid
  }

  get createdBy(): number {
    return this._createdBy
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedBy() {
    return this._updatedBy
  }

  get updatedAt() {
    return this._updatedAt
  }

  /**
   * Marca la entidad como modificada por un usuario.
   * Debe llamarse en cada método que modifique el estado.
   */
  protected markUpdated(updatedBy: number): void {
    this._updatedBy = updatedBy
    this._updatedAt = new Date()
  }

  /**
   * Compara dos entidades por su identificador único.
   */
  equals(other: Entity): boolean {
    if (other === null || other === undefined) {
      return false
    }
    if (this === other) {
      return true
    }
    return this._uid === other._uid
  }

  set updatedAt(updatedAt: Date | null) {
    this._updatedAt = updatedAt
  }

  set updatedBy(updatedBy: number | null) {
    this._updatedBy = updatedBy
  }
}
