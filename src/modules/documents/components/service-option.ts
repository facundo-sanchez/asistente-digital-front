import type { UUID } from "@/types/api";

/** Servicio como opción de un selector. */
export interface ServiceOption {
  id: UUID;
  name: string;
}
