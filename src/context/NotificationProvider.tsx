import { useState, useCallback, useContext, type ReactNode } from "react"
import { NotificationContext } from "./NotificationContext"
import { useWebSocket } from "@/hooks/useWebSocket"
import { notificationApi } from "@/api/notification.api"
import { MessageContext } from "./MessageContext"
import type { AppNotification, WSMessage } from "@/types"

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  // Get message handler from MessageContext (it's a sibling provider)
  const messageCtx = useContext(MessageContext)

  const handleWSMessage = useCallback(
    (message: WSMessage) => {
      // Route to message handler for message-related events
      if (
        message.type === "NEW_MESSAGE" ||
        message.type === "MESSAGE_DELIVERED" ||
        message.type === "MESSAGE_READ" ||
        message.type === "TYPING" ||
        message.type === "TOTAL_UNREAD_MESSAGES"
      ) {
        messageCtx?.handleWSMessage(message)
        return
      }

      // Handle notification events
      if (message.type === "UNREAD_COUNT") {
        setUnreadCount(message.data.count)
      }

      if (message.type === "NEW_NOTIFICATION") {
        setUnreadCount(message.data.unreadCount)
        setNotifications((prev) => [message.data.notification, ...prev])
      }
    },
    [messageCtx]
  )

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
    <NotificationContext.Provider
      value={{ unreadCount, notifications, markAllRead, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  )
}