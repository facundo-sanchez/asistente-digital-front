/** Backend: org.acme.integration.infrastructure.rest.dto */
import type { ISODate, ISODateTime, UUID } from "./common";

export const INTEGRATION_PROVIDERS = ["GMAIL", "PROVIDER_API"] as const;
export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export const INTEGRATION_STATUSES = [
  "ACTIVE",
  "REAUTH_REQUIRED",
  "ERROR",
  "DISCONNECTED",
] as const;
export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[number];

export const PROCESSED_ITEM_RESULTS = [
  "IMPORTED",
  "DISCARDED",
  "DUPLICATE",
  "FAILED",
] as const;
export type ProcessedItemResult = (typeof PROCESSED_ITEM_RESULTS)[number];

/** GET /integrations, /integrations/{id} */
export interface IntegrationResponse {
  id: UUID;
  provider: IntegrationProvider;
  /** Ej. la cuenta de Gmail. */
  externalAccountId: string;
  status: IntegrationStatus;
  scopes: string[];
  syncFrom: ISODate | null;
  lastSyncAt: ISODateTime | null;
  disconnectedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /integrations/gmail/connect */
export interface GmailConnectRequest {
  /** Importar correos desde esta fecha. null = solo nuevos. */
  syncFrom?: ISODate | null;
}

/** Respuesta de /integrations/gmail/connect: redirigir al usuario a esta URL. */
export interface AuthorizationUrlResponse {
  authorizationUrl: string;
}

/** "Detectado en tu correo". */
export interface DetectedEmailResponse {
  id: UUID;
  integrationId: UUID;
  documentId: UUID | null;
  providerId: UUID | null;
  serviceId: UUID | null;
  sender: string | null;
  subject: string | null;
  receivedAt: ISODateTime | null;
  result: ProcessedItemResult;
  /** Ej. NOT_MATCHED, NO_ATTACHMENT, UNKNOWN_CUSTOMER. */
  discardReason: string | null;
  processedAt: ISODateTime;
}
