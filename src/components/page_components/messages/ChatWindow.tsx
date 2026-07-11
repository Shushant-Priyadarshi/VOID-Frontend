import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send } from "lucide-react"
import { messageApi } from "@/api/message.api"
import { useSession } from "@/lib/authClient"
import { useMessageContext } from "@/hooks/useMessageContext"
import { Link } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import type { Conversation, Message } from "@/types"

interface Props {
  conversation: Conversation
  onBack?: () => void
  isTyping: boolean
  incomingMessage: Message | null
}

export default function ChatWindow({ conversation, onBack, isTyping, incomingMessage }: Props) {
  const { data: session } = useSession()
  const currentUserId = session?.user.id ?? ""
  const { statusEvent } = useMessageContext()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await messageApi.getMessages(conversation.id)
        if (cancelled) return
        setMessages(res.data)
        setCursor(res.data[0]?.id)
        setHasMore(res.data.length === 30)
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    messageApi.markRead(conversation.id).catch(console.error)
    return () => { cancelled = true }
  }, [conversation.id])

  useEffect(() => {
    if (!incomingMessage) return
    if (incomingMessage.conversationId !== conversation.id) return
    setMessages((prev) => {
      if (prev.some((m) => m.id === incomingMessage.id)) return prev
      return [...prev, incomingMessage]
    })
  }, [incomingMessage, conversation.id])

  useEffect(() => {
    if (!statusEvent) return
    if (statusEvent.conversationId !== conversation.id) return
    setMessages((prev) =>
      prev.map((m) => {
        if (m.senderId !== currentUserId) return m
        if (statusEvent.status === "READ" && m.status !== "READ") return { ...m, status: "READ" }
        if (statusEvent.status === "DELIVERED" && m.status === "SENT") return { ...m, status: "DELIVERED" }
        return m
      })
    )
  }, [statusEvent, conversation.id, currentUserId])

  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, loading])

  const stopTyping = useDebouncedCallback(() => {
    messageApi.sendTyping(conversation.id, false, conversation.otherUser.id).catch(console.error)
  }, 1500)

  function handleInputChange(value: string) {
    setInput(value)
    messageApi.sendTyping(conversation.id, true, conversation.otherUser.id).catch(console.error)
    stopTyping()
  }

  async function handleSend() {
    if (!input.trim() || sending) return
    const content = input.trim()
    setInput("")
    setSending(true)
    try {
      const res = await messageApi.sendMessage(conversation.id, content)
      setMessages((prev) => [...prev, res.data])
    } finally {
      setSending(false)
    }
  }

  async function loadMore() {
    if (!cursor || !hasMore) return
    const res = await messageApi.getMessages(conversation.id, cursor)
    setMessages((prev) => [...res.data, ...prev])
    setCursor(res.data[0]?.id)
    setHasMore(res.data.length === 30)
  }

  let lastOwnIndex = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === currentUserId) { lastOwnIndex = i; break }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
        {onBack && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 md:hidden" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Link to={`/u/${conversation.otherUser.id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs font-medium">{conversation.otherUser.name[0]?.toUpperCase()}</AvatarFallback>
            <AvatarImage src={conversation.otherUser.profileImage ?? undefined} />
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {conversation.otherUser.name}
            </p>
            {isTyping && (
              <p className="text-[11px] text-teal-600 dark:text-teal-400">typing…</p>
            )}
          </div>
        </Link>
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1 px-4 py-4">
        {hasMore && !loading && (
          <button
            onClick={loadMore}
            className="mb-4 flex w-full items-center justify-center text-xs text-muted-foreground hover:text-foreground"
          >
            Load older messages
          </button>
        )}

        <div className="flex flex-col gap-1">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === currentUserId
            const next = messages[i + 1]
            const showTime = !next || next.senderId !== msg.senderId
            const showStatus = isMine && i === lastOwnIndex
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMine={isMine}
                showTime={showTime}
                showStatus={showStatus}
              />
            )
          })}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input bar */}
      <div className="shrink-0 border-t bg-background px-4 py-3">
        <div className="flex items-center gap-2.5 rounded-full border bg-muted/30 pl-4 pr-1.5 py-1.5 focus-within:border-teal-400/60 focus-within:bg-background transition-colors">
          <input
            placeholder="Message…"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={cn(
              "h-7 w-7 shrink-0 rounded-full transition-all",
              input.trim()
                ? "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}