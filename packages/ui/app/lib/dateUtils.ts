export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateRange = (
  start: Date | string | null | undefined,
  end: Date | string | null | undefined,
): string => {
  if (!start && !end) return ''
  if (!start) return `Hasta ${formatDate(end)}`
  if (!end) return `Desde ${formatDate(start)}`
  return `${formatDate(start)} – ${formatDate(end)}`
}
