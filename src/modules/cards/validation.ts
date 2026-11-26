/**
 * Validación del formulario de tarjeta. Replica la del backend (CardRequest y
 * ManageCardUseCase): el backend vuelve a validar siempre.
 */
import * as yup from "yup";
import { CARD_BRANDS } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

const FOUR_DIGITS = /^\d{4}$/;

export const cardSchema = yup.object({
  service: yup.mixed<ServiceOption>().nullable().required("Elegí el banco o emisor"),
  name: yup.string().trim().required("Poné un nombre para reconocerla (ej. «Visa Galicia»)").max(100, "Hasta 100 caracteres"),
  brand: yup.string().oneOf(CARD_BRANDS, "Elegí la marca").required("Elegí la marca"),
  lastFour: yup.string().trim().default("").test("four", "Son los últimos 4 números", (v) => !v || FOUR_DIGITS.test(v)),
  accountLastFour: yup.string().trim().default("").test("four", "Son los últimos 4 números", (v) => !v || FOUR_DIGITS.test(v)),
  holderName: yup.string().trim().max(150, "Hasta 150 caracteres").default(""),
  additional: yup.boolean().default(false),
  creditLimit: yup
    .string()
    .trim()
    .default("")
    .test("amount", "Ingresá un importe válido, ej. 1500000", (v) => !v || /^\d{1,15}([.,]\d{1,2})?$/.test(v)),
});

export type CardFormValues = yup.InferType<typeof cardSchema>;
