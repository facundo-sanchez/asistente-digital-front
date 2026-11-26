import type { ServiceOption } from "@/modules/documents/components/service-option";

export interface InvoiceFormProps {
  /** Servicios del usuario: toda factura tiene servicio (RN-003). */
  services: ServiceOption[];
  /** Alta desde un servicio: arranca con él elegido y al cancelar vuelve a él. */
  defaultService?: ServiceOption;
}
