const dateFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
const dateTimeFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

/** "2026-11-25" → "25/11/2026". Las fechas sin hora se formatean en UTC para no correrse un día. */
export function formatDate(isoDate: string | null): string | null {
  return isoDate ? dateFormat.format(new Date(`${isoDate}T00:00:00Z`)) : null;
}

/** Instante del backend → día en la zona del usuario. */
export function formatDay(isoDateTime: string): string {
  return dateTimeFormat.format(new Date(isoDateTime));
}
