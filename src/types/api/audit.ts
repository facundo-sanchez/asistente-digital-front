/** Backend: org.acme.audit.infrastructure.rest.dto */
import type { ISODateTime, JsonObject, UUID } from "./common";

/** "Últimas actividades" del dashboard. */
export interface ActivityResponse {
  id: UUID;
  /** Ej. PAYMENT_REGISTERED, INVOICE_CONFIRMED. */
  action: string;
  /** Ej. PAYMENT, INVOICE. */
  entityType: string;
  entityId: UUID | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
}
