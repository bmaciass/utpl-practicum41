/**
 * Interface base para todos los casos de uso.
 * Los casos de uso representan las acciones que el sistema puede realizar.
 *
 * @template TInput - Tipo de los datos de entrada
 * @template TOutput - Tipo de los datos de salida
 */
export interface IUseCase<TInput, TOutput> {
  /**
   * Ejecuta el caso de uso.
   *
   * @param input - Datos de entrada para el caso de uso
   * @param actorId - ID del usuario que ejecuta la acción (para auditoría)
   * @returns Resultado del caso de uso
   */
  execute(input: TInput, actorId: string): Promise<TOutput>
}

/**
 * Interface para casos de uso que no requieren input.
 *
 * @template TOutput - Tipo de los datos de salida
 */
export interface IUseCaseWithoutInput<TOutput> {
  execute(actorId: string): Promise<TOutput>
}

/**
 * Interface para casos de uso que no requieren actor (operaciones públicas).
 *
 * @template TInput - Tipo de los datos de entrada
 * @template TOutput - Tipo de los datos de salida
 */
export interface IPublicUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}
