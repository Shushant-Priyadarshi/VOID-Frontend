import { useState } from "react"
import FollowListDialog from "./FollowListDialog"

interface Props {
  userId: string
  followers: number
  following: number
}

export default function FollowStats({ userId, followers, following }: Props) {
  const [dialogMode, setDialogMode] = useState<"followers" | "following" | null>(null)

  return (
    <>
      <div className="flex items-center gap-5">
        <button
          onClick={() => setDialogMode("followers")}
          className="group flex flex-col items-start transition-opacity hover:opacity-80"
        >
          <span className="text-base font-bold leading-tight tabular-nums text-foreground">
            {followers.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Followers
          </span>
        </button>

        <div className="h-8 w-px bg-border/60" />

        <button
          onClick={() => setDialogMode("following")}
          className="group flex flex-col items-start transition-opacity hover:opacity-80"
        >
          <span className="text-base font-bold leading-tight tabular-nums text-foreground">
            {following.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Following
          </span>
        </button>
      </div>

      {dialogMode && (
        <FollowListDialog
          userId={userId}
          mode={dialogMode}
          open={!!dialogMode}
          onOpenChange={(open) => !open && setDialogMode(null)}
        />
      )}
    </>
  )
}