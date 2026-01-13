import type { Entity } from '../entities/common/Entity'

/**
 * Opciones de paginación para consultas.
 */
export interface PaginationOptions {
  offset?: number
  limit?: number
}

/**
 * Interface base para todos los repositorios.
 * Define las operaciones CRUD mínimas que todo repositorio debe implementar.
 *
 * @template T - Tipo de la entidad que maneja el repositorio
 */
export interface IRepository<T extends Entity> {
  /**
   * Busca una entidad por su ID numérico (clave primaria de BD).
   */
  findById(id: number): Promise<T | null>

  /**
   * Busca una entidad por su UID string (identificador único público).
   */
  findByUid(uid: string): Promise<T | null>

  /**
   * Busca una entidad por su UID o lanza error si no existe.
   */
  findByUidOrThrow(uid: string): Promise<T>

  /**
   * Guarda una entidad (insert o update según exista).
   * Retorna la entidad guardada (útil para obtener IDs generados).
   */
  save(entity: T): Promise<T>

  /**
   * Elimina una entidad por su UID.
   */
  delete(uid: string): Promise<void>
}

/**
 * Interface extendida para repositorios que soportan listados.
 */
export interface IListableRepository<T extends Entity, TFilters = unknown>
  extends IRepository<T> {
  /**
   * Busca múltiples entidades con filtros opcionales.
   */
  findMany(options?: {
    where?: TFilters
    pagination?: PaginationOptions
  }): Promise<T[]>

  /**
   * Cuenta el total de entidades que cumplen los filtros.
   */
  count(where?: TFilters): Promise<number>
}
