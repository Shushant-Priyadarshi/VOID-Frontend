import { createContext } from "react"
import type { Conversation } from "@/types"
import type { WSMessage } from "@/types"

export interface MessageContextValue {
  conversations: Conversation[]
  totalUnread: number
  activeConversationId: string | null
  setActiveConversationId: (id: string | null) => void
  fetchConversations: () => Promise<void>
  handleWSMessage: (msg: WSMessage) => void
  updateMessageStatus: (conversationId: string, messageId: string, status: "DELIVERED" | "READ") => void
  typingConversations: Record<string, boolean>
  statusEvent: { conversationId: string; status: "DELIVERED" | "READ" } | null
}

export const MessageContext = createContext<MessageContextValue | null>(null)