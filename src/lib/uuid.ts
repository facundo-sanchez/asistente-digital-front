const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** true si el texto es un UUID: un id con otro formato en la URL no llega al backend. */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
