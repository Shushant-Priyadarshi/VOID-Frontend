import { useEffect, useState, useRef } from "react"
import { useMessageContext } from "@/hooks/useMessageContext"
import { useSession } from "@/lib/authClient"
import { ScrollArea } from "@/components/ui/scroll-area"
import ConversationList from "@/components/page_components/messages/ConversationList"
import ChatWindow from "@/components/page_components/messages/ChatWindow"
import { MessageSquare } from "lucide-react"
import type { Conversation, Message } from "@/types"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router-dom"

export default function MessagePage() {
  const { data: session } = useSession()
  const {
    conversations,
    fetchConversations,
    setActiveConversationId,
    typingConversations,
  } = useMessageContext()

  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  const [searchParams] = useSearchParams()
  const convIdFromUrl = searchParams.get("conv")

  // The context keeps each conversation's lastMessage up to date in real time.
  // Derive the latest message for the open chat during render (no effect/setState
  // needed) and hand it to ChatWindow, which appends it if it's new.
  const activeConvLive = activeConv
    ? conversations.find((c) => c.id === activeConv.id) ?? null
    : null
  const incomingMessage: Message | null = activeConvLive?.lastMessage ?? null

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Fix: derive active conversation from URL param without synchronous setState in effect
  // Using a separate flag so we only auto-select once, not on every conversations change
  const didAutoSelect = useRef(false)
  useEffect(() => {
    if (!convIdFromUrl || conversations.length === 0 || didAutoSelect.current) return
    const conv = conversations.find((c) => c.id === convIdFromUrl)
    if (!conv) return
    didAutoSelect.current = true

    // Wrap in setTimeout(0) to defer out of the effect's synchronous execution
    // This satisfies React's rule about not calling setState synchronously
    // in an effect that also runs other side effects
    const id = window.setTimeout(() => {
      setActiveConv(conv)
      setMobileView("chat")
    }, 0)

    return () => window.clearTimeout(id)
  }, [convIdFromUrl, conversations])

  useEffect(() => {
    setActiveConversationId(activeConv?.id ?? null)
    return () => setActiveConversationId(null)
  }, [activeConv, setActiveConversationId])

  function handleSelectConversation(conv: Conversation) {
    setActiveConv(conv)
    setMobileView("chat")
  }

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-3.5rem)] overflow-hidden md:h-screen">
      {/* Left — conversation list */}
      <div
        className={cn(
          "flex w-full flex-col border-r md:w-80 md:shrink-0",
          mobileView === "chat" ? "hidden md:flex" : "flex"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <p className="text-base font-bold">Messages</p>
        </div>
        <ScrollArea className="flex-1">
          <ConversationList
            conversations={conversations}
            activeId={activeConv?.id ?? null}
            currentUserId={session?.user.id ?? ""}
            onSelect={handleSelectConversation}
          />
        </ScrollArea>
      </div>

      {/* Right — chat window */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          mobileView === "list" ? "hidden md:flex" : "flex"
        )}
      >
        {activeConv ? (
          <ChatWindow
            key={activeConv.id}
            conversation={activeConv}
            onBack={() => setMobileView("list")}
            isTyping={!!typingConversations[activeConv.id]}
            incomingMessage={incomingMessage}
          />
        ) : (
          <div className="hidden h-full flex-col items-center justify-center gap-3 text-center md:flex">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm font-medium">Your messages</p>
            <p className="text-xs text-muted-foreground">
              Select a conversation or visit someone's profile to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}