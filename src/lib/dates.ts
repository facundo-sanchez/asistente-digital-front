const dateFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
const dateTimeFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

/**
 * "2026-11-25" → "25/11/2026". Las fechas sin hora se formatean en UTC para no correrse un día.
 * Una fecha a medio tipear en un input (año de 5 dígitos, vacía) devuelve null en vez de romper.
 */
export function formatDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
}

/** Instante del backend → día en la zona del usuario. */
export function formatDay(isoDateTime: string): string {
  return dateTimeFormat.format(new Date(isoDateTime));
}
