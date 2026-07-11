import { cn } from "@/lib/utils"
import { Check, CheckCheck } from "lucide-react"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import type { Message } from "@/types"

interface Props {
  message: Message
  isMine: boolean
  showTime: boolean
  showStatus: boolean
}

function StatusLabel({ status }: { status: string }) {
  if (status === "READ") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-teal-500">
        <CheckCheck className="h-3 w-3" /> Seen
      </span>
    )
  }
  if (status === "DELIVERED") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
        <CheckCheck className="h-3 w-3" /> Delivered
      </span>
    )
  }
  return (
    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/50">
      <Check className="h-3 w-3" /> Sent
    </span>
  )
}

export default function MessageBubble({ message, isMine, showTime, showStatus }: Props) {
  return (
    <div className={cn("flex flex-col gap-0.5", isMine ? "items-end" : "items-start")}>
      <div className={cn(
        "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
        isMine
          ? "rounded-br-md bg-teal-600 text-white dark:bg-teal-600"
          : "rounded-bl-md bg-muted text-foreground"
      )}>
        {message.content}
      </div>

      {(showTime || showStatus) && (
        <div className={cn(
          "flex items-center gap-2 px-1",
          isMine ? "flex-row-reverse" : "flex-row"
        )}>
          {showTime && (
            <span className="text-[10px] text-muted-foreground/50">
              {formatRelativeTime(message.createdAt)}
            </span>
          )}
          {showStatus && isMine && <StatusLabel status={message.status} />}
        </div>
      )}
    </div>
  )
}