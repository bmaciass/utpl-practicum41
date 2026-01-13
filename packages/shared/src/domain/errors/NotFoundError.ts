import { DomainError } from './DomainError'

/**
 * Error lanzado cuando una entidad no es encontrada.
 */
export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND'

  constructor(entityName: string, identifier: string, field?: string) {
    super(
      `${entityName} with identifier '${identifier}' ${field ? `in the field ${field}` : ''} was not found`,
    )
  }

  /**
   * Factory method para crear error de entidad no encontrada.
   */
  static forEntity(entityName: string, identifier: string): NotFoundError {
    return new NotFoundError(entityName, identifier)
  }
}
