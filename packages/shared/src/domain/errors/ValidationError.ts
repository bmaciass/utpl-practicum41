import { DomainError } from './DomainError'

/**
 * Error lanzado cuando una validación de dominio falla.
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'
  readonly field?: string

  constructor(message: string, field?: string) {
    super(message)
    this.field = field
  }

  /**
   * Factory method para crear error de validación con campo específico.
   */
  static forField(field: string, message: string): ValidationError {
    return new ValidationError(message, field)
  }

  override toJSON(): {
    code: string
    message: string
    name: string
    field?: string
  } {
    return {
      ...super.toJSON(),
      field: this.field,
    }
  }
}
