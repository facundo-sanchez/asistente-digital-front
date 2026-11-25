/** Valor admitido en un query string. undefined, null y "" se omiten. */
type QueryValue = string | number | boolean | null | undefined;

/** Arma "?a=1&b=x" a partir de un objeto, omitiendo los valores vacíos. "" si no queda ninguno. */
export function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}
