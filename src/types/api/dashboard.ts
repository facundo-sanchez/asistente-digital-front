/** Backend: org.acme.dashboard.application.model (módulo 7) */
import type { CurrencyCode, Decimal, ISODate } from "./common";

/** Lo del mes en una moneda. */
export interface MonthTotalsResponse {
  currency: CurrencyCode;
  total: Decimal;
  paid: Decimal;
  pending: Decimal;
}

/** Lo vencido sin pagar en una moneda. */
export interface OverdueTotalsResponse {
  currency: CurrencyCode;
  count: number;
  balance: Decimal;
}

/** GET /dashboard: mes actual en la zona del usuario; una fila por moneda (no se suman ni convierten). */
export interface DashboardSummaryResponse {
  monthStart: ISODate;
  monthEnd: ISODate;
  month: MonthTotalsResponse[];
  /** Vencimientos del mes sin importe cargado (no entran en los totales). */
  withoutAmount: number;
  overdue: OverdueTotalsResponse[];
  /** Cuántos vencen en los próximos 7 días. */
  dueSoon: number;
  activeServices: number;
}
