/**
 * Validación del formulario de servicio. Replica la del backend (ServiceRequest y
 * RegisterServiceUseCase): el backend vuelve a validar siempre.
 */
import * as yup from "yup";
import { BILLING_FREQUENCIES, SERVICE_CATEGORIES, type ProviderResponse } from "@/types/api";

export const serviceSchema = yup.object({
  provider: yup.mixed<ProviderResponse>().nullable().required("Elegí el proveedor"),
  name: yup.string().trim().required("Poné un nombre para reconocerlo (ej. «Luz casa»)").max(150, "Hasta 150 caracteres"),
  customerReference: yup.string().trim().max(150, "Hasta 150 caracteres").default(""),
  category: yup.string().oneOf(SERVICE_CATEGORIES, "Elegí la categoría").required("Elegí la categoría"),
  billingFrequency: yup.string().oneOf(BILLING_FREQUENCIES, "Elegí la periodicidad").required("Elegí la periodicidad"),
  startDate: yup.string().default(""),
  endDate: yup
    .string()
    .default("")
    .test("after-start", "La fecha de fin no puede ser anterior a la de inicio", function (endDate) {
      const { startDate } = this.parent as { startDate?: string };
      // Fechas ISO (yyyy-mm-dd): la comparación de texto respeta el orden
      return !endDate || !startDate || endDate >= startDate;
    }),
  notes: yup.string().trim().max(2000, "Hasta 2000 caracteres").default(""),
  autoDebit: yup.boolean().default(false),
  autoDebitMethod: yup.string().trim().max(100, "Hasta 100 caracteres").default(""),
  paymentUrl: yup
    .string()
    .trim()
    .max(500, "Hasta 500 caracteres")
    .matches(/^(https:\/\/\S+)?$/, "Ingresá un link que empiece con https://")
    .default(""),
});

export type ServiceFormValues = yup.InferType<typeof serviceSchema>;
