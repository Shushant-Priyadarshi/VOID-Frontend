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
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => setDialogMode("followers")}
          className="hover:underline"
        >
          <span className="font-semibold">{followers}</span>{" "}
          <span className="text-muted-foreground">Followers</span>
        </button>
        <button
          onClick={() => setDialogMode("following")}
          className="hover:underline"
        >
          <span className="font-semibold">{following}</span>{" "}
          <span className="text-muted-foreground">Following</span>
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