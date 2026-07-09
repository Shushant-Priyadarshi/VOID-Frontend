import { api } from "@/lib/api"
import type { AppNotification } from "@/types"

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

export const notificationApi = {
  getNotifications: () =>
    api.get<ApiEnvelope<AppNotification[]>>("/api/v1/notifications"),

  getUnreadCount: () =>
    api.get<ApiEnvelope<{ count: number }>>("/api/v1/notifications/unread-count"),

  markAllRead: () =>
    api.patch<ApiEnvelope<null>>("/api/v1/notifications/mark-read"),
}