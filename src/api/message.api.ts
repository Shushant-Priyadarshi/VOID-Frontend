import { api } from "@/lib/api"
import type { Conversation, Message } from "@/types"

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

export const messageApi = {
  getConversations: () =>
    api.get<ApiEnvelope<Conversation[]>>("/api/v1/messages/conversations"),

  getOrCreateConversation: (userId: string) =>
    api.get<ApiEnvelope<Conversation>>(`/api/v1/messages/conversations/with/${userId}`),

  getMessages: (conversationId: string, cursor?: string) => {
    const params = cursor ? `?cursor=${cursor}` : ""
    return api.get<ApiEnvelope<Message[]>>(
      `/api/v1/messages/conversations/${conversationId}/messages${params}`
    )
  },

  sendMessage: (conversationId: string, content: string) =>
    api.post<ApiEnvelope<Message>>(
      `/api/v1/messages/conversations/${conversationId}/messages`,
      { content }
    ),

  markRead: (conversationId: string) =>
    api.patch<ApiEnvelope<null>>(
      `/api/v1/messages/conversations/${conversationId}/read`
    ),

  sendTyping: (conversationId: string, isTyping: boolean, recipientId: string) =>
    api.post<ApiEnvelope<null>>("/api/v1/messages/typing", {
      conversationId,
      isTyping,
      recipientId,
    }),
}