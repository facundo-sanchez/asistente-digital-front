/**
 * Validación del formulario de factura. Replica la del backend (InvoiceRequest e
 * InvoiceDraftValidator): el backend vuelve a validar siempre.
 */
import * as yup from "yup";
import type { ServiceOption } from "@/modules/documents/components/service-option";
import { OBLIGATION_CURRENCIES } from "@/modules/obligations/validation";

export const invoiceSchema = yup.object({
  service: yup.mixed<ServiceOption>().nullable().required("Elegí el servicio de la factura"),
  invoiceNumber: yup.string().trim().max(120, "Hasta 120 caracteres").default(""),
  billingPeriod: yup.string().trim().max(30, "Hasta 30 caracteres").default(""),
  issueDate: yup.string().default(""),
  dueDate: yup
    .string()
    .required("Poné la fecha de vencimiento")
    .test("after-issue", "El vencimiento no puede ser anterior a la emisión", function (dueDate) {
      const { issueDate } = this.parent as { issueDate?: string };
      // Fechas ISO (yyyy-mm-dd): la comparación de texto respeta el orden
      return !dueDate || !issueDate || dueDate >= issueDate;
    }),
  totalAmount: yup
    .string()
    .trim()
    .required("Ingresá el importe")
    .test("amount", "Ingresá un importe válido, ej. 48500,50", (value) => /^\d{1,15}([.,]\d{1,2})?$/.test(value ?? "")),
  currency: yup.string().oneOf(OBLIGATION_CURRENCIES).required(),
  paymentCode: yup.string().trim().max(200, "Hasta 200 caracteres").default(""),
});

export type InvoiceFormValues = yup.InferType<typeof invoiceSchema>;
