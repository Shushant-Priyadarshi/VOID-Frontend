import { cn } from "@/lib/utils"
import { Check, CheckCheck } from "lucide-react"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import type { Message } from "@/types"

interface Props {
  message: Message
  isMine: boolean
  showTime: boolean
  // When true, render an explicit Sent/Delivered/Seen label under this bubble.
  showStatus?: boolean
}

function StatusIcon({ status }: { status: string }) {
  if (status === "READ") return <CheckCheck className="h-3 w-3 text-primary" />
  if (status === "DELIVERED") return <CheckCheck className="h-3 w-3 opacity-60" />
  return <Check className="h-3 w-3 opacity-60" />
}

function statusLabel(status: string) {
  if (status === "READ") return "Seen"
  if (status === "DELIVERED") return "Delivered"
  return "Sent"
}

export default function MessageBubble({ message, isMine, showTime, showStatus }: Props) {
  return (
    <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
          isMine
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground"
        )}
      >
        {message.content}
      </div>

      {showTime && (
        <div className={cn("mt-0.5 flex items-center gap-1", isMine && "flex-row-reverse")}>
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(message.createdAt)}
          </span>
          {isMine && !showStatus && <StatusIcon status={message.status} />}
        </div>
      )}

      {isMine && showStatus && (
        <div className="mt-0.5 flex items-center gap-1">
          <StatusIcon status={message.status} />
          <span
            className={cn(
              "text-[10px] font-medium",
              message.status === "READ" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {statusLabel(message.status)}
          </span>
        </div>
      )}
    </div>
  )
}