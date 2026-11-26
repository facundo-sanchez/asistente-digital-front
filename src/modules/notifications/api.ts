/** Llamadas de avisos desde el navegador (módulo 8). */
import { api } from "@/lib/api/client";
import type {
  NotificationPreferenceRequest,
  NotificationPreferenceResponse,
  NotificationResponse,
  PageResponse,
  UnreadCountResponse,
} from "@/types/api";

export const notificationsApi = {
  unreadCount: () => api.get<UnreadCountResponse>("notifications/unread-count"),
  latest: (size: number) => api.get<PageResponse<NotificationResponse>>(`notifications?size=${size}`),
  markRead: (id: string) => api.patch<NotificationResponse>(`notifications/${id}/read`),
  markAllRead: () => api.post<UnreadCountResponse>("notifications/read-all"),
  savePreferences: (preferences: NotificationPreferenceRequest[]) =>
    api.put<NotificationPreferenceResponse[]>("notification-preferences", preferences),
};
