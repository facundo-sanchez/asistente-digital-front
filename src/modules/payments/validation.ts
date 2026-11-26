/**
 * Validación del pago. Replica la del backend (PaymentRequest y RegisterPaymentUseCase):
 * el backend vuelve a validar siempre.
 */
import * as yup from "yup";
import { PAYMENT_METHODS } from "@/types/api";
import { OBLIGATION_CURRENCIES } from "@/modules/obligations/validation";

/** Hoy en la zona del navegador, como yyyy-mm-dd. */
export function today(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export const paymentSchema = yup.object({
  amount: yup
    .string()
    .trim()
    .required("Ingresá el importe pagado")
    .test("amount", "Ingresá un importe válido, ej. 48500,50", (value) => /^\d{1,15}([.,]\d{1,2})?$/.test(value ?? ""))
    .test("positive", "El importe tiene que ser mayor a cero", (value) => Number((value ?? "").replace(",", ".")) > 0),
  currency: yup.string().oneOf(OBLIGATION_CURRENCIES).required(),
  paymentDate: yup
    .string()
    .required("Poné la fecha de pago")
    .test("not-future", "La fecha de pago no puede ser futura", (value) => !value || value <= today()),
  paymentMethod: yup.string().oneOf(PAYMENT_METHODS, "Elegí el medio de pago").required("Elegí el medio de pago"),
  receiptDocumentId: yup.string().default(""),
  notes: yup.string().trim().max(1000, "Hasta 1000 caracteres").default(""),
});

export type PaymentFormValues = yup.InferType<typeof paymentSchema>;
