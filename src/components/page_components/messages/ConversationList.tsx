import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import type { Conversation } from "@/types"
import { Check, CheckCheck, MessageSquare } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { listVariants, itemVariants } from "@/lib/animations"

interface Props {
  conversations: Conversation[]
  activeId: string | null
  currentUserId: string
  onSelect: (conv: Conversation) => void
}

function StatusIcon({ status, isMine }: { status: string; isMine: boolean }) {
  if (!isMine) return null
  if (status === "READ") return <CheckCheck className="h-3 w-3 text-teal-500" />
  if (status === "DELIVERED") return <CheckCheck className="h-3 w-3 text-muted-foreground/60" />
  return <Check className="h-3 w-3 text-muted-foreground/60" />
}

export default function ConversationList({ conversations, activeId, currentUserId, onSelect }: Props) {
  const shouldReduce = useReducedMotion()

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">No messages yet</p>
          <p className="max-w-[180px] text-xs text-muted-foreground">
            Visit someone's profile and tap Message to start.
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={shouldReduce ? {} : listVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col py-1"
    >
      {conversations.map((conv) => {
        const isActive = conv.id === activeId
        const isMine = conv.lastMessage?.senderId === currentUserId
        const hasUnread = conv.unreadCount > 0 && !isMine

        return (
          <motion.button
            key={conv.id}
            variants={shouldReduce ? {} : itemVariants}
            onClick={() => onSelect(conv)}
            className={cn(
              "relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
              isActive && "bg-muted/60"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-teal-500" />
            )}

            <Avatar className="h-11 w-11 shrink-0">
              <AvatarImage src={conv.otherUser.profileImage ?? undefined} />
              <AvatarFallback className="text-sm font-medium">
                {conv.otherUser.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className={cn(
                  "truncate text-sm",
                  hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground/90"
                )}>
                  {conv.otherUser.name}
                </p>
                <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground/60">
                  {formatRelativeTime(conv.lastMessageAt)}
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-1.5">
                <StatusIcon status={conv.lastMessage?.status ?? "SENT"} isMine={isMine} />
                <p className={cn(
                  "truncate text-xs",
                  hasUnread ? "font-medium text-foreground" : "text-muted-foreground/70"
                )}>
                  {isMine ? <span className="text-muted-foreground/60">You: </span> : null}
                  {conv.lastMessagePreview ?? "Start a conversation"}
                </p>
                {hasUnread && (
                  <span className="ml-auto shrink-0 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-teal-600 px-1 text-[9px] font-bold text-white">
                    {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
}