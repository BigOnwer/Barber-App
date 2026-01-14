type FormatOptions = {
  locale?: string
}

/**
 * Formata uma data para: DD/MM/YYYY
 */
export function formatDay(
  date: Date | string,
  options?: FormatOptions
): string {
  if (!date) return ""

  return new Intl.DateTimeFormat(options?.locale ?? "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

/**
 * Formata uma data para: HH:mm
 */
export function formatHour(
  date: Date | string,
  options?: FormatOptions
): string {
  if (!date) return ""

  return new Intl.DateTimeFormat(options?.locale ?? "pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

/**
 * Formata uma data para: DD/MM/YYYY HH:mm
 */
export function formatDayAndHour(
  date: Date | string,
  options?: FormatOptions
): string {
  if (!date) return ""

  return new Intl.DateTimeFormat(options?.locale ?? "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
