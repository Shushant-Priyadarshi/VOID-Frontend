import { useState, useCallback, useRef, useEffect, type ReactNode } from "react"
import { MessageContext } from "./MessageContext"
import { messageApi } from "@/api/message.api"
import type { Conversation, WSMessage } from "@/types"

export function MessageProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [totalUnread, setTotalUnread] = useState(0)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [typingConversations, setTypingConversations] = useState<Record<string, boolean>>({})
  const [statusEvent, setStatusEvent] = useState<
    { conversationId: string; status: "DELIVERED" | "READ" } | null
  >(null)

  // Fix: sync ref in an effect, not during render
  const activeConvRef = useRef<string | null>(null)
  useEffect(() => {
    activeConvRef.current = activeConversationId
  }, [activeConversationId])

  // Per-conversation safety timers that clear a stale "typing" flag if the
  // matching isTyping:false stop event is ever missed.
  const typingTimers = useRef<Record<string, number>>({})

  const fetchConversations = useCallback(async () => {
    const res = await messageApi.getConversations()
    setConversations(res.data)
  }, [])

  const updateMessageStatus = useCallback(
    (conversationId: string, messageId: string, status: "DELIVERED" | "READ") => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c
          if (!c.lastMessage) return c
          return {
            ...c,
            lastMessage:
              c.lastMessage.id === messageId || status === "READ"
                ? { ...c.lastMessage, status }
                : c.lastMessage,
          }
        })
      )
    },
    []
  )

  const handleWSMessage = useCallback(
    (msg: WSMessage) => {
      if (msg.type === "TOTAL_UNREAD_MESSAGES") {
        setTotalUnread(msg.data.count)
      }

      if (msg.type === "NEW_MESSAGE") {
        const { conversationId, message } = msg.data

        setConversations((prev) => {
          const existing = prev.find((c) => c.id === conversationId)

          if (existing) {
            const rest = prev.filter((c) => c.id !== conversationId)
            return [
              {
                ...existing,
                lastMessage: message,
                lastMessagePreview: message.content,
                lastMessageAt: message.createdAt,
                unreadCount:
                  activeConvRef.current === conversationId
                    ? 0
                    : existing.unreadCount + 1,
              },
              ...rest,
            ]
          }

          // unknown conversation — refetch the list
          messageApi.getConversations().then((res) => setConversations(res.data))
          return prev
        })

        if (activeConvRef.current === conversationId) {
          messageApi.markRead(conversationId).catch(console.error)
        }
      }

      if (msg.type === "MESSAGE_DELIVERED") {
        updateMessageStatus(msg.data.conversationId, msg.data.messageId, "DELIVERED")
        setStatusEvent({ conversationId: msg.data.conversationId, status: "DELIVERED" })
      }

      if (msg.type === "MESSAGE_READ") {
        updateMessageStatus(msg.data.conversationId, "", "READ")
        setStatusEvent({ conversationId: msg.data.conversationId, status: "READ" })
      }

      if (msg.type === "TYPING") {
        const { conversationId, isTyping } = msg.data
        setTypingConversations((prev) => ({ ...prev, [conversationId]: isTyping }))

        // Safety timeout: clear the flag if the isTyping:false stop event is missed.
        window.clearTimeout(typingTimers.current[conversationId])
        if (isTyping) {
          typingTimers.current[conversationId] = window.setTimeout(() => {
            setTypingConversations((prev) => ({ ...prev, [conversationId]: false }))
          }, 5000)
        }
      }
    },
    [updateMessageStatus]
  )

  return (
    <MessageContext.Provider
      value={{
        conversations,
        totalUnread,
        activeConversationId,
        setActiveConversationId,
        fetchConversations,
        handleWSMessage,
        updateMessageStatus,
        typingConversations,
        statusEvent,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}