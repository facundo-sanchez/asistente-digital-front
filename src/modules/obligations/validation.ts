/**
 * Validación del formulario de obligación. Replica la del backend (ObligationRequest y
 * ObligationDraftValidator): el backend vuelve a validar siempre.
 */
import * as yup from "yup";
import { OBLIGATION_TYPES } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

export const OBLIGATION_CURRENCIES = ["ARS", "USD"] as const;

export const obligationSchema = yup.object({
  title: yup.string().trim().required("Poné un título (ej. «VTV auto»)").max(200, "Hasta 200 caracteres"),
  obligationType: yup.string().oneOf(OBLIGATION_TYPES, "Elegí el tipo").required("Elegí el tipo"),
  service: yup.mixed<ServiceOption>().nullable().default(null),
  // Texto del campo: vacío = sin importe. Admite coma decimal ("48500,50")
  amount: yup
    .string()
    .trim()
    .default("")
    .test("amount", "Ingresá un importe válido, ej. 48500,50", (value) => !value || /^\d{1,15}([.,]\d{1,2})?$/.test(value)),
  currency: yup.string().oneOf(OBLIGATION_CURRENCIES).required(),
  dueDate: yup.string().required("Poné la fecha de vencimiento"),
  description: yup.string().trim().max(2000, "Hasta 2000 caracteres").default(""),
});

export type ObligationFormValues = yup.InferType<typeof obligationSchema>;

/** "48500,50" → 48500.5; vacío → null. */
export function parseAmount(value: string): number | null {
  return value.trim() ? Number(value.trim().replace(",", ".")) : null;
}
