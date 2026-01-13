/**
 * Clase base abstracta para Value Objects.
 * Los Value Objects son objetos inmutables que se comparan por valor, no por identidad.
 * Ejemplos: Email, DNI, Money, DateRange.
 */
export abstract class ValueObject<T> {
  protected readonly props: T

  protected constructor(props: T) {
    this.props = Object.freeze(props)
  }

  /**
   * Compara dos Value Objects por sus propiedades.
   */
  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false
    }
    if (other.props === undefined) {
      return false
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props)
  }

  /**
   * Retorna las propiedades del Value Object.
   * Útil para serialización o debugging.
   */
  toValue(): T {
    return this.props
  }
}
