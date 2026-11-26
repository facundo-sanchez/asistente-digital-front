/**
 * Validación del formulario de resumen. Replica la del backend (CardStatementRequest y
 * CardStatementDraftValidator): el backend vuelve a validar siempre.
 */
import * as yup from "yup";

const AMOUNT = /^\d{1,15}([.,]\d{1,2})?$/;
const amount = (message: string) => yup.string().trim().default("").test("amount", message, (v) => !v || AMOUNT.test(v));

export const statementSchema = yup.object({
  closingDate: yup.string().default(""),
  dueDate: yup
    .string()
    .required("Poné la fecha de vencimiento")
    .test("after-closing", "El vencimiento no puede ser anterior al cierre", function (dueDate) {
      const { closingDate } = this.parent as { closingDate?: string };
      // Fechas ISO (yyyy-mm-dd): la comparación de texto respeta el orden
      return !dueDate || !closingDate || dueDate >= closingDate;
    }),
  totalAmount: amount("Ingresá un importe válido, ej. 250000,50"),
  totalAmountUsd: amount("Ingresá un importe válido, ej. 40,99"),
  minimumPayment: amount("Ingresá un importe válido"),
  nextClosingDate: yup.string().default(""),
  nextDueDate: yup.string().default(""),
  documentId: yup.string().default(""),
});

export type StatementFormValues = yup.InferType<typeof statementSchema>;
