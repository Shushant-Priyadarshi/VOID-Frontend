import { useEffect } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import { usePostDrawer } from "@/hooks/usePostDrawer"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { AppNotification } from "@/types"
import { useState } from "react"

export default function Notifications() {
  const { notifications, unreadCount, markAllRead, fetchNotifications } = useNotifications()
  const { openPost } = usePostDrawer()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
      .finally(() => setLoading(false))

    // Mark all read when user opens the page
    if (unreadCount > 0) {
      markAllRead()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">Notifications</h1>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Notifications</h1>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium">No notifications yet</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            When someone likes or comments on your posts or follows you, you'll see it here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Notifications</h1>
      <div className="flex flex-col gap-1">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onPostClick={openPost} />
        ))}
      </div>
    </div>
  )
}

function NotificationItem({
  notification: n,
  onPostClick,
}: {
  notification: AppNotification
  onPostClick: (id: string) => void
}) {
  const icon = {
    LIKE: <Heart className="h-3.5 w-3.5 text-rose-500" />,
    COMMENT: <MessageCircle className="h-3.5 w-3.5 text-blue-500" />,
    FOLLOW: <UserPlus className="h-3.5 w-3.5 text-green-500" />,
  }[n.type]

  const message = {
    LIKE: `liked your post`,
    COMMENT: `commented on your post`,
    FOLLOW: `started following you`,
  }[n.type]

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-3 transition-colors",
        !n.read && "bg-primary/5"
      )}
    >
      {/* Avatar with notification type icon overlaid */}
      <div className="relative shrink-0">
        <Link to={`/u/${n.actor.id}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={n.actor.profileImage ?? undefined} />
            <AvatarFallback className="text-xs">
              {n.actor.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background shadow">
          {icon}
        </span>
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">
          <Link to={`/u/${n.actor.id}`} className="font-semibold hover:underline">
            {n.actor.name}
          </Link>{" "}
          <span className="text-muted-foreground">{message}</span>
          {n.post && (
            <>
              {" "}
              <button
                onClick={() => onPostClick(n.post!.id)}
                className="font-medium hover:underline"
              >
                {n.post.title}
              </button>
            </>
          )}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatRelativeTime(n.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  )
}