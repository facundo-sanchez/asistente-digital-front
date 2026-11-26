/** Backend: org.acme.notification.infrastructure.rest.dto */
import type { ISODateTime, UUID } from "./common";

export const NOTIFICATION_CHANNELS = ["EMAIL", "WEB", "PUSH"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

/** ALL solo se usa en preferencias ("todos los tipos"). */
export const NOTIFICATION_TYPES = [
  "ALL",
  "OBLIGATION_DUE_SOON",
  "OBLIGATION_OVERDUE",
  "DOCUMENT_DETECTED",
  "INVOICE_PENDING_VALIDATION",
  "INTEGRATION_DISCONNECTED",
  "DOCUMENT_EXPIRING",
  "MAINTENANCE_DUE",
  /** Resumen de tarjeta detectado por email sin PDF: invitar a subirlo. */
  "CARD_STATEMENT_AVAILABLE",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** GET /notifications */
export interface NotificationResponse {
  id: UUID;
  obligationId: UUID | null;
  documentId: UUID | null;
  integrationId: UUID | null;
  notificationType: Exclude<NotificationType, "ALL">;
  channel: NotificationChannel;
  title: string;
  message: string;
  read: boolean;
  readAt: ISODateTime | null;
  createdAt: ISODateTime;
}

/** GET /notification-preferences (lista) */
export interface NotificationPreferenceResponse {
  id: UUID;
  channel: NotificationChannel;
  notificationType: NotificationType;
  enabled: boolean;
  /** Días de anticipación; 0 = el día del vencimiento. */
  daysBefore: number[];
}

/** Elemento de PUT /notification-preferences (el body es NotificationPreferenceRequest[]). */
export interface NotificationPreferenceRequest {
  channel: NotificationChannel;
  notificationType: NotificationType;
  enabled: boolean;
  /** 0 a 60, máximo 10 valores. */
  daysBefore: number[];
}

/** GET /notifications/unread-count */
export interface UnreadCountResponse {
  unread: number;
}
