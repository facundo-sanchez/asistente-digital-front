/** Una fila de la tabla de movimientos (propuesta de la IA o movimiento guardado). */
export interface MovementRow {
  date: string | null;
  description: string | null;
  merchant: string | null;
  installmentNumber: number | null;
  installmentTotal: number | null;
  amount: number | null;
  currency: string | null;
}
