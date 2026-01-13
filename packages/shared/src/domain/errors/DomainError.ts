/**
 * Error base para todos los errores del dominio.
 * Extiende Error nativo y añade código de error para manejo estructurado.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string

  protected constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Serializa el error para respuestas API.
   */
  toJSON(): { code: string; message: string; name: string } {
    return {
      code: this.code,
      message: this.message,
      name: this.name,
    }
  }
}
