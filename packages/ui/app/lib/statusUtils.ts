export const translateTaskStatus = (status: string): string => {
  const translations: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    reviewing: 'En Revisión',
    done: 'Completado',
    cancelled: 'Cancelado',
  }
  return translations[status] || status
}

export const translateProjectStatus = (status: string): string => {
  const translations: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }
  return translations[status] || status
}
