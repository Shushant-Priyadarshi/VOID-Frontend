import { useEffect, useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import { usePostDrawer } from "@/hooks/usePostDrawer"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { AppNotification } from "@/types"
import { motion, useReducedMotion } from "framer-motion"
import { pageVariants, listVariants, itemVariants } from "@/lib/animations"

export default function Notifications() {
  const { notifications, unreadCount, markAllRead, fetchNotifications } = useNotifications()
  const { openPost } = usePostDrawer()
  const [loading, setLoading] = useState(true)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    fetchNotifications().finally(() => setLoading(false))
    if (unreadCount > 0) markAllRead()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
        </div>
        <div className="flex flex-col gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg px-3 py-3.5">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2 pt-0.5">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <motion.div
        variants={shouldReduce ? {} : pageVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Bell className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">All caught up</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              When someone likes or comments on your posts or follows you, it'll appear here.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4"
    >
      <h1 className="text-xl font-bold tracking-tight">Notifications</h1>

      <motion.div
        variants={shouldReduce ? {} : listVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col"
      >
        {unread.length > 0 && (
          <div className="mb-1">
            <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              New
            </p>
            {unread.map((n) => (
              <motion.div key={n.id} variants={shouldReduce ? {} : itemVariants}>
                <NotificationItem notification={n} onPostClick={openPost} />
              </motion.div>
            ))}
          </div>
        )}

        {read.length > 0 && (
          <div>
            {unread.length > 0 && (
              <p className="mb-1 mt-3 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Earlier
              </p>
            )}
            {read.map((n) => (
              <motion.div key={n.id} variants={shouldReduce ? {} : itemVariants}>
                <NotificationItem notification={n} onPostClick={openPost} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

const iconMap = {
  LIKE: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
  COMMENT: { icon: MessageCircle, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30" },
  FOLLOW: { icon: UserPlus, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40" },
}

function NotificationItem({
  notification: n,
  onPostClick,
}: {
  notification: AppNotification
  onPostClick: (id: string) => void
}) {
  const { icon: Icon, color, bg } = iconMap[n.type]

  const messageVerb = {
    LIKE: "liked your post",
    COMMENT: "commented on your post",
    FOLLOW: "started following you",
  }[n.type]

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg px-3 py-3.5 transition-colors hover:bg-muted/50",
        !n.read && "border-l-2 border-teal-500 bg-teal-500/[0.03] pl-[calc(0.75rem-2px)] dark:bg-teal-500/[0.05]"
      )}
    >
      {/* Avatar + type icon */}
      <div className="relative shrink-0">
        <Link to={`/u/${n.actor.id}`}>
          <Avatar className="h-10 w-10 ring-1 ring-border/50">
            <AvatarImage src={n.actor.profileImage ?? undefined} />
            <AvatarFallback className="text-xs font-medium">
              {n.actor.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <span className={cn(
          "absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full shadow-sm ring-1 ring-background",
          bg
        )}>
          <Icon className={cn("h-2.5 w-2.5", color)} />
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm leading-snug text-foreground">
          <Link
            to={`/u/${n.actor.id}`}
            className="font-semibold hover:text-teal-600 dark:hover:text-teal-400"
          >
            {n.actor.name}
          </Link>{" "}
          <span className="text-muted-foreground">{messageVerb}</span>
          {n.post && (
            <>
              {" — "}
              <button
                onClick={() => onPostClick(n.post!.id)}
                className="font-medium text-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline underline-offset-2"
              >
                {n.post.title}
              </button>
            </>
          )}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/70">
          {formatRelativeTime(n.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
      )}
    </div>
  )
}