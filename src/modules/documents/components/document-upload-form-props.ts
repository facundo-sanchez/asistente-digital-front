import type { DocumentType } from "@/types/api";
import type { ServiceOption } from "./service-option";

export interface DocumentUploadFormProps {
  /** Si viene, el documento queda asociado a este servicio y al terminar se vuelve a él. */
  service?: ServiceOption;
  /** Tipos que la IA puede leer ahora (vacío si no hay IA). */
  aiTypes: DocumentType[];
}
