const monthFormat = new Intl.DateTimeFormat("es-AR", { month: "short", timeZone: "UTC" });

/** "2026-11" → "nov". */
export function monthLabel(key: string): string {
  return monthFormat.format(new Date(`${key}-01T00:00:00Z`)).replace(".", "");
}
