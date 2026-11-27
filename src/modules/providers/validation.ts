/** Validación del alta de proveedor propio. Replica la del backend (ProviderRequest). */
import * as yup from "yup";
import { SERVICE_CATEGORIES } from "@/types/api";

export const providerSchema = yup.object({
  name: yup.string().trim().required("Escribí el nombre del proveedor").max(150, "Hasta 150 caracteres"),
  category: yup.string().oneOf(SERVICE_CATEGORIES, "Elegí la categoría").required("Elegí la categoría"),
  website: yup
    .string()
    .trim()
    .max(500, "Hasta 500 caracteres")
    .matches(/^(https?:\/\/\S+)?$/, "Tiene que empezar con http:// o https://")
    .default(""),
  invoiceSender: yup
    .string()
    .trim()
    .max(200, "Hasta 200 caracteres")
    .matches(/^(([^@\s]+@)?[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+)?$/, "Poné una dirección de email (info@empresa.com.ar) o un dominio (empresa.com.ar)")
    .default(""),
});

export type ProviderFormValues = yup.InferType<typeof providerSchema>;
