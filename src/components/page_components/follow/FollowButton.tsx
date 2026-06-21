import { useState } from "react"
import { Button } from "@/components/ui/button"
import { followApi } from "@/api/follow.api"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import AuthPromptDialog from "@/components/common/AuthPromptDialog"

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
        if (next) {
          await followApi.follow(userId)
        } else {
          await followApi.unfollow(userId)
        }
      } catch {
        // revert on failure
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
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <AuthPromptDialog open={promptOpen} onOpenChange={setPromptOpen} />
    </>
  )
}