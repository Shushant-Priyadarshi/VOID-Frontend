import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  incomingMessage: Message | null  // ← parent passes new WS messages via prop
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

  // ChatWindow is remounted per conversation (keyed on conversation.id in the parent),
  // so state starts fresh on mount — no synchronous resets needed here. Only the async
  // load lives in the effect; its setState calls run after the await, off the render path.
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

  // Append messages streamed in over the WebSocket (delivered via the incomingMessage
  // prop). This accumulates external, non-render-derivable data into local state — the
  // legitimate "subscribe to an external system, then setState" case for this effect.
  useEffect(() => {
    if (!incomingMessage) return
    if (incomingMessage.conversationId !== conversation.id) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing external WS stream into local list
    setMessages((prev) => {
      // deduplicate — don't add if already present (e.g. own sent message)
      if (prev.some((m) => m.id === incomingMessage.id)) return prev
      return [...prev, incomingMessage]
    })
  }, [incomingMessage, conversation.id])

  // Apply delivered/seen receipts to my own messages in the open window.
  // Read receipts are conversation-level, so this is coarse by design:
  // READ marks all my not-yet-read messages read; DELIVERED bumps my sent ones.
  useEffect(() => {
    if (!statusEvent) return
    if (statusEvent.conversationId !== conversation.id) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- applying external WS receipt to local list
    setMessages((prev) =>
      prev.map((m) => {
        if (m.senderId !== currentUserId) return m
        if (statusEvent.status === "READ" && m.status !== "READ") {
          return { ...m, status: "READ" }
        }
        if (statusEvent.status === "DELIVERED" && m.status === "SENT") {
          return { ...m, status: "DELIVERED" }
        }
        return m
      })
    )
  }, [statusEvent, conversation.id, currentUserId])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length, loading])

  const stopTyping = useDebouncedCallback(() => {
    messageApi
      .sendTyping(conversation.id, false, conversation.otherUser.id)
      .catch(console.error)
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

  // Index of my most recent message — the only one that shows the status label.
  let lastOwnIndex = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].senderId === currentUserId) {
      lastOwnIndex = i
      break
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        {onBack && (
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Link to={`/u/${conversation.otherUser.id}`} className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{conversation.otherUser.name[0]?.toUpperCase()}</AvatarFallback>
            <AvatarImage src={conversation.otherUser.profileImage ?? undefined} />
          </Avatar>
          <div>
            <p className="text-sm font-semibold leading-tight">{conversation.otherUser.name}</p>
            {isTyping && <p className="text-xs text-muted-foreground">typing...</p>}
          </div>
        </Link>
      </div>

      {/* Fix: remove `ref` from ScrollArea — it doesn't forward refs */}
      <ScrollArea className="flex-1 px-4 py-3">
        {hasMore && !loading && (
          <Button variant="ghost" size="sm" className="mb-3 w-full text-xs" onClick={loadMore}>
            Load older messages
          </Button>
        )}

        <div className="flex flex-col gap-1.5">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === currentUserId
            const next = messages[i + 1]
            const showTime = !next || next.senderId !== msg.senderId
            // Show the Sent/Delivered/Seen label only under my most recent message.
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

      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Message..."
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 rounded-full"
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={handleSend}
            disabled={!input.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}