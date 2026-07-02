import { Bell } from "lucide-react"

export default function Notifications() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Bell className="h-12 w-12 text-muted-foreground/40" />
      <p className="text-sm font-medium">No notifications yet</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        When someone follows you, likes or comments on your posts, you'll see it here.
      </p>
    </div>
  )
}