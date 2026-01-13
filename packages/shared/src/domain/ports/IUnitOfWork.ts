/**
 * Interface para el patrón Unit of Work.
 * Maneja transacciones que involucran múltiples repositorios.
 *
 * En lugar de usar begin/commit/rollback explícitos (que son propensos a errores),
 * usamos el patrón funcional withTransaction que garantiza cleanup automático.
 *
 * @template TRepos - Tipo del objeto con los repositorios transaccionales
 */
export interface IUnitOfWork<TRepos = unknown> {
  /**
   * Ejecuta una función dentro de una transacción.
   * Si la función completa exitosamente, se hace commit.
   * Si lanza una excepción, se hace rollback automático.
   *
   * @template T - Tipo de retorno de la función
   * @param work - Función a ejecutar dentro de la transacción, recibe los repositorios
   * @returns El resultado de la función
   */
  withTransaction<T>(work: (repos: TRepos) => Promise<T>): Promise<T>
}

/**
 * Factory function type para crear repositorios con una conexión específica.
 */
export type RepositoryFactory<T> = (connection: unknown) => T
