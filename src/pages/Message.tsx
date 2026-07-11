import { useEffect, useState, useRef } from "react"
import { useMessageContext } from "@/hooks/useMessageContext"
import { useSession } from "@/lib/authClient"
import { ScrollArea } from "@/components/ui/scroll-area"
import ConversationList from "@/components/page_components/messages/ConversationList"
import ChatWindow from "@/components/page_components/messages/ChatWindow"
import { MessageSquareDashed } from "lucide-react"
import type { Conversation, Message } from "@/types"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router-dom"

export default function MessagePage() {
  const { data: session } = useSession()
  const { conversations, fetchConversations, setActiveConversationId, typingConversations } = useMessageContext()
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  const [searchParams] = useSearchParams()
  const convIdFromUrl = searchParams.get("conv")

  const activeConvLive = activeConv
    ? conversations.find((c) => c.id === activeConv.id) ?? null
    : null
  const incomingMessage: Message | null = activeConvLive?.lastMessage ?? null

  useEffect(() => { fetchConversations() }, [fetchConversations])

  const didAutoSelect = useRef(false)
  useEffect(() => {
    if (!convIdFromUrl || conversations.length === 0 || didAutoSelect.current) return
    const conv = conversations.find((c) => c.id === convIdFromUrl)
    if (!conv) return
    didAutoSelect.current = true
    const id = window.setTimeout(() => { setActiveConv(conv); setMobileView("chat") }, 0)
    return () => window.clearTimeout(id)
  }, [convIdFromUrl, conversations])

  useEffect(() => {
    setActiveConversationId(activeConv?.id ?? null)
    return () => setActiveConversationId(null)
  }, [activeConv, setActiveConversationId])

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-3.5rem)] overflow-hidden md:h-screen">
      {/* Left panel */}
      <div className={cn(
        "flex min-h-0 w-full flex-col border-r bg-background md:w-80 md:shrink-0",
        mobileView === "chat" ? "hidden md:flex" : "flex"
      )}>
        <div className="flex h-14 shrink-0 items-center border-b px-5">
          <h1 className="text-base font-bold tracking-tight text-foreground">Messages</h1>
        </div>
        <ScrollArea className="flex-1">
          <ConversationList
            conversations={conversations}
            activeId={activeConv?.id ?? null}
            currentUserId={session?.user.id ?? ""}
            onSelect={(conv) => { setActiveConv(conv); setMobileView("chat") }}
          />
        </ScrollArea>
      </div>

      {/* Right panel */}
      <div className={cn(
        "flex min-h-0 flex-1 flex-col bg-background",
        mobileView === "list" ? "hidden md:flex" : "flex"
      )}>
        {activeConv ? (
          <ChatWindow
            key={activeConv.id}
            conversation={activeConv}
            onBack={() => setMobileView("list")}
            isTyping={!!typingConversations[activeConv.id]}
            incomingMessage={incomingMessage}
          />
        ) : (
          <div className="hidden h-full flex-col items-center justify-center gap-4 text-center md:flex">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageSquareDashed className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Your messages</p>
              <p className="max-w-[200px] text-xs text-muted-foreground">
                Select a conversation or visit a profile to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}