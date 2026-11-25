/** searchParams de una página del App Router (Next 16: es una Promise). */
export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Primer valor de un parámetro de búsqueda, o undefined. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
