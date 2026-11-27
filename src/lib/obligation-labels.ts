/** Tipos y estados de obligación (los mismos del backend) con su nombre en español. */
import type { EffectiveObligationStatus, ObligationType } from "@/types/api";

export const OBLIGATION_TYPE_LABELS: Record<ObligationType, string> = {
  INVOICE_PAYMENT: "Factura",
  CREDIT_CARD_PAYMENT: "Tarjeta de crédito",
  TAX: "Impuesto",
  INSURANCE: "Seguro",
  VEHICLE_INSPECTION: "VTV",
  DOCUMENT_RENEWAL: "Renovación de documento",
  SUBSCRIPTION: "Suscripción",
  MAINTENANCE: "Mantenimiento",
  RENT: "Alquiler",
  LOAN: "Préstamo",
  OTHER: "Otro",
};

export const OBLIGATION_STATUS_LABELS: Record<EffectiveObligationStatus, string> = {
  PENDING: "Pendiente",
  PARTIALLY_PAID: "Pago parcial",
  DUE_SOON: "Próxima a vencer",
  OVERDUE: "Vencida",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
};

/** Color del punto de estado (siempre acompañado de la palabra). */
export const OBLIGATION_STATUS_COLORS: Record<EffectiveObligationStatus, string> = {
  PENDING: "text.secondary",
  PARTIALLY_PAID: "info.main",
  DUE_SOON: "warning.main",
  OVERDUE: "error.main",
  PAID: "success.main",
  CANCELLED: "text.disabled",
};
