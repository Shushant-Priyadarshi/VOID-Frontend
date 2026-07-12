import { useState } from "react"
import { Button } from "@/components/ui/button"
import { followApi } from "@/api/follow.api"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import AuthPromptDialog from "@/components/common/AuthPromptDialog"
import { UserCheck, UserPlus } from "lucide-react"

interface Props {
  userId: string
  initialIsFollowing: boolean
  onChange?: (isFollowing: boolean) => void
}

export default function FollowButton({ userId, initialIsFollowing, onChange }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const { withAuth, promptOpen, setPromptOpen } = useRequireAuth()

  async function handleClick() {
    withAuth(async () => {
      setLoading(true)
      const next = !isFollowing
      setIsFollowing(next)
      onChange?.(next)
      try {
        if (next) await followApi.follow(userId)
        else await followApi.unfollow(userId)
      } catch {
        setIsFollowing(!next)
        onChange?.(!next)
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <>
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        disabled={loading}
        onClick={handleClick}
        className={
          isFollowing
            ? "gap-1.5 border-border/60 text-xs"
            : "gap-1.5 bg-teal-600 text-white hover:bg-teal-700 text-xs dark:bg-teal-600 dark:hover:bg-teal-500"
        }
      >
        {isFollowing ? (
          <><UserCheck className="h-3.5 w-3.5" /> Following</>
        ) : (
          <><UserPlus className="h-3.5 w-3.5" /> Follow</>
        )}
      </Button>
      <AuthPromptDialog open={promptOpen} onOpenChange={setPromptOpen} />
    </>
  )
}