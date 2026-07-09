import { useState, useCallback, type ReactNode } from "react"
import { NotificationContext } from "./NotificationContext"
import { useWebSocket } from "@/hooks/useWebSocket"
import { notificationApi } from "@/api/notification.api"
import type { AppNotification, WSMessage } from "@/types"

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const handleWSMessage = useCallback((message: WSMessage) => {
    if (message.type === "UNREAD_COUNT") {
      setUnreadCount(message.data.count)
    }

    if (message.type === "NEW_NOTIFICATION") {
      setUnreadCount(message.data.unreadCount)
      setNotifications((prev) => [message.data.notification, ...prev])
    }
  }, [])

  const { send } = useWebSocket(handleWSMessage)

  const markAllRead = useCallback(() => {
    send({ type: "MARK_NOTIFICATIONS_READ" })
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    notificationApi.markAllRead().catch(console.error)
  }, [send])

  const fetchNotifications = useCallback(async () => {
    const res = await notificationApi.getNotifications()
    setNotifications(res.data)
  }, [])

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, markAllRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}