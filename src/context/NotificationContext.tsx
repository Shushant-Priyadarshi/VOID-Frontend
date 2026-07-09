import { createContext} from "react"
import type { AppNotification} from "@/types"

interface NotificationContextValue {
  unreadCount: number
  notifications: AppNotification[]
  markAllRead: () => void
  fetchNotifications: () => Promise<void>
}

export const NotificationContext = createContext<NotificationContextValue | null>(null)