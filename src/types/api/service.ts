/** Backend: org.acme.service.infrastructure.rest.dto */
import type {
  BillingFrequency,
  ISODate,
  ISODateTime,
  JsonObject,
  ServiceCategory,
  UUID,
} from "./common";

/** GET /services, GET /services/{id} */
export interface ServiceResponse {
  id: UUID;
  providerId: UUID;
  /** Nombre del proveedor, para mostrar sin otra consulta. */
  providerName: string;
  name: string;
  /** Nro. de cliente / socio / suministro. */
  customerReference: string | null;
  category: ServiceCategory;
  billingFrequency: BillingFrequency;
  startDate: ISODate | null;
  endDate: ISODate | null;
  active: boolean;
  notes: string | null;
  /** Página donde se pagan sus facturas (https). */
  paymentUrl: string | null;
  /** Se paga por débito automático: el vencimiento se da por pagado el día que vence. */
  autoDebit: boolean;
  /** Con qué se debita (texto libre). */
  autoDebitMethod: string | null;
  metadata: JsonObject;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /services, PUT /services/{id} */
export interface ServiceRequest {
  providerId: UUID;
  name: string;
  customerReference?: string | null;
  category: ServiceCategory;
  billingFrequency: BillingFrequency;
  startDate?: ISODate | null;
  endDate?: ISODate | null;
  notes?: string | null;
  paymentUrl?: string | null;
  autoDebit?: boolean;
  autoDebitMethod?: string | null;
  metadata?: JsonObject | null;
}

/** PATCH /services/{id}/status */
export interface ServiceStatusRequest {
  active: boolean;
}
