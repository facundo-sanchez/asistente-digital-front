import type { ProviderResponse, ServiceResponse } from "@/types/api";

export interface ServiceFormProps {
  /** Si viene, se edita; si no, es un alta. */
  service?: ServiceResponse;
  /** Alta con el proveedor y el nro. de cliente ya completos (ej. una factura que llegó por email). */
  preset?: { provider: ProviderResponse; customerReference: string };
  /** Ruta interna a la que volver después del alta (ej. la revisión de la factura). */
  next?: string;
}
