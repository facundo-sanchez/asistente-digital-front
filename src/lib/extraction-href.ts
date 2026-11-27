/** La pantalla de revisión según lo que leyó la IA (por el esquema de la propuesta). */
export function extractionHref(extraction: { id: string; schemaVersion: string }): string {
  if (extraction.schemaVersion.startsWith("invoice/")) return `/invoice-extractions/${extraction.id}`;
  if (extraction.schemaVersion.startsWith("loan_contract/")) return `/loans/new?extraction=${extraction.id}`;
  if (extraction.schemaVersion.startsWith("loan_receipt/")) return `/loan-extractions/${extraction.id}`;
  return `/extractions/${extraction.id}`;
}

/** Qué es la propuesta, para listarla. */
export function extractionLabel(schemaVersion: string): string {
  if (schemaVersion.startsWith("invoice/")) return "Factura";
  if (schemaVersion.startsWith("loan_contract/")) return "Alta de préstamo";
  if (schemaVersion.startsWith("loan_receipt/")) return "Pago de cuota";
  return "Resumen de tarjeta";
}
