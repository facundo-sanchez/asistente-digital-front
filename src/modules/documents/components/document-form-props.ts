import type { DocumentResponse } from "@/types/api";
import type { ServiceOption } from "./service-option";

export interface DocumentFormProps {
  document: DocumentResponse;
  /** Servicios del usuario para asociar el documento. */
  services: ServiceOption[];
}
