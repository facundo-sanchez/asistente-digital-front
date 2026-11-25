const formats = new Map<string, Intl.NumberFormat>();

/** 48500 + "ARS" → "$ 48.500,00". Sin importe → null. */
export function formatMoney(amount: number | null, currency: string | null): string | null {
  if (amount === null || currency === null) return null;
  let format = formats.get(currency);
  if (!format) {
    format = new Intl.NumberFormat("es-AR", { style: "currency", currency, currencyDisplay: currency === "ARS" ? "symbol" : "code" });
    formats.set(currency, format);
  }
  return format.format(amount);
}
