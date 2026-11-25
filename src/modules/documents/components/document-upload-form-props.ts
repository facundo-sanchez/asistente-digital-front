import type { ServiceOption } from "./service-option";

export interface DocumentUploadFormProps {
  /** Si viene, el documento queda asociado a este servicio y al terminar se vuelve a él. */
  service?: ServiceOption;
}
