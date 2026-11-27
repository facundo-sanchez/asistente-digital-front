/** El cronograma que se va a crear, para mostrarlo antes de guardar (el backend calcula lo mismo). */

/** El mismo día de cada mes que la primera; si un mes no lo tiene, el último (31/1 → 28/2 → 31/3). */
export function installmentDate(first: string, index: number): string {
  const [y, m, d] = first.split("-").map(Number);
  const month = m - 1 + index;
  const year = y + Math.floor(month / 12);
  const monthInYear = ((month % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, monthInYear + 1, 0)).getUTCDate();
  const day = Math.min(d, lastDay);
  return `${year}-${String(monthInYear + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export interface SchedulePreview {
  first: string;
  last: string;
  total: number;
  pending: number;
}

/** Primera y última cuota, total a pagar y cuántas quedan pendientes; null si faltan datos. */
export function schedulePreview(firstDueDate: string, count: number, amount: number | null, paid: number): SchedulePreview | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(firstDueDate) || !(count >= 1) || !amount || amount <= 0) return null;
  return {
    first: firstDueDate,
    last: installmentDate(firstDueDate, count - 1),
    total: Math.round(amount * count * 100) / 100,
    pending: Math.max(count - Math.max(paid || 0, 0), 0),
  };
}
