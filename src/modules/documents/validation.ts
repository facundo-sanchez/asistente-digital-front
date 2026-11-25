/**
 * Validación de la edición de un documento. Replica la del backend
 * (DocumentUpdateRequest): el backend vuelve a validar siempre.
 */
import * as yup from "yup";
import { DOCUMENT_TYPES } from "@/types/api";
import type { ServiceOption } from "./components/service-option";

export const documentSchema = yup.object({
  title: yup.string().trim().max(200, "Hasta 200 caracteres").default(""),
  documentType: yup.string().oneOf(DOCUMENT_TYPES, "Elegí el tipo").required("Elegí el tipo"),
  service: yup.mixed<ServiceOption>().nullable().default(null),
  expiresOn: yup.string().default(""),
});

export type DocumentFormValues = yup.InferType<typeof documentSchema>;
