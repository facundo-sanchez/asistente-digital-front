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

/**
 * Sistema francés (tasa fija): capital + interés constante; interés = saldo × TNA / 12; IVA 21 % del interés.
 * Sin sellados, como el backend. Devuelve el importe de cada cuota.
 */
export function frenchAmounts(principal: number, annualRate: number, count: number): number[] {
  if (!(principal > 0) || !(annualRate > 0) || !(count >= 1)) return [];
  const rate = annualRate / 1200;
  const payment = (principal * rate) / (1 - Math.pow(1 + rate, -count));
  const round = (x: number) => Math.round(x * 100) / 100;
  const amounts: number[] = [];
  let balance = principal;
  for (let n = 1; n <= count; n++) {
    const interest = balance * rate;
    const capital = n === count ? balance : payment - interest;
    balance -= capital;
    amounts.push(round(round(capital) + round(interest) + round(interest * 0.21)));
  }
  return amounts;
}

export interface SchedulePreview {
  first: string;
  last: string;
  total: number;
  pending: number;
}

/** Primera y última cuota, total a pagar y cuántas quedan pendientes; null si faltan datos. */
export function schedulePreview(
  firstDueDate: string,
  count: number,
  amount: number | null,
  paid: number,
  french: number[] = [],
): SchedulePreview | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(firstDueDate) || !(count >= 1) || (french.length === 0 && (!amount || amount <= 0))) return null;
  return {
    first: firstDueDate,
    last: installmentDate(firstDueDate, count - 1),
    total: french.length > 0 ? Math.round(french.reduce((a, b) => a + b, 0) * 100) / 100 : Math.round((amount ?? 0) * count * 100) / 100,
    pending: Math.max(count - Math.max(paid || 0, 0), 0),
  };
}
