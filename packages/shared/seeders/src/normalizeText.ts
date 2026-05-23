export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function findByNormalizedName<T extends { name: string }>(
  items: T[],
  pattern: string,
) {
  const normalizedPattern = normalizeText(pattern)
  return items.find((item) =>
    normalizeText(item.name).includes(normalizedPattern),
  )
}
