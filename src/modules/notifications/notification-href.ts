import type { NotificationResponse } from "@/types/api";

/** A dónde lleva un aviso: su vencimiento o su documento (desde ahí se llega a la revisión de la IA). */
export function notificationHref(notification: NotificationResponse): string {
  if (notification.obligationId) return `/obligations/${notification.obligationId}`;
  if (notification.documentId) return `/documents/${notification.documentId}`;
  if (notification.integrationId) return "/integrations";
  return "/notifications";
}
