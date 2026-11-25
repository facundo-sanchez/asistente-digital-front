/** Periodicidad de facturación (la misma del backend) con su nombre en español. */
import type { BillingFrequency } from "@/types/api";

export const BILLING_FREQUENCY_LABELS: Record<BillingFrequency, string> = {
  NONE: "Sin periodicidad",
  WEEKLY: "Semanal",
  MONTHLY: "Mensual",
  BIMONTHLY: "Bimestral",
  QUARTERLY: "Trimestral",
  SEMIANNUAL: "Semestral",
  ANNUAL: "Anual",
};
