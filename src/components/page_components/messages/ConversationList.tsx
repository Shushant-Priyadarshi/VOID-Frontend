import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import type { Conversation } from "@/types"
import { Check, CheckCheck } from "lucide-react"

interface Props {
  conversations: Conversation[]
  activeId: string | null
  currentUserId: string
  onSelect: (conv: Conversation) => void
}

function MessageStatusIcon({ status, isMine }: { status: string; isMine: boolean }) {
  if (!isMine) return null
  if (status === "READ") return <CheckCheck className="h-3.5 w-3.5 text-primary" />
  if (status === "DELIVERED") return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />
  return <Check className="h-3.5 w-3.5 text-muted-foreground" />
}

export default function ConversationList({ conversations, activeId, currentUserId, onSelect }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium">No messages yet</p>
        <p className="text-xs text-muted-foreground">
          Visit someone's profile and hit Message to start a conversation.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId
        const isMine = conv.lastMessage?.senderId === currentUserId
        const hasUnread = conv.unreadCount > 0 && !isMine

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
              isActive && "bg-accent"
            )}
          >
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarImage src={conv.otherUser.profileImage ?? undefined} />
              <AvatarFallback>{conv.otherUser.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className={cn("truncate text-sm", hasUnread ? "font-semibold" : "font-medium")}>
                  {conv.otherUser.name}
                </p>
                <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
                  {formatRelativeTime(conv.lastMessageAt)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <MessageStatusIcon
                  status={conv.lastMessage?.status ?? "SENT"}
                  isMine={isMine}
                />
                <p
                  className={cn(
                    "truncate text-xs",
                    hasUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {isMine ? "You: " : ""}
                  {conv.lastMessagePreview ?? "Start a conversation"}
                </p>
                {hasUnread && (
                  <span className="ml-auto shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}