import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { messageApi } from "@/api/message.api"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import AuthPromptDialog from "@/components/common/AuthPromptDialog"
import FollowButton from "@/components/page_components/follow/FollowButton"
import type { FollowCounts } from "@/types"

interface Props {
  userId: string
  counts: FollowCounts | null
  onFollowChange: (isFollowing: boolean) => void
}

export default function PublicProfileActions({ userId, counts, onFollowChange }: Props) {
  const navigate = useNavigate()
  const { withAuth, promptOpen, setPromptOpen } = useRequireAuth()
  const [loading, setLoading] = useState(false)

  async function handleMessage() {
    withAuth(async () => {
      setLoading(true)
      try {
        const res = await messageApi.getOrCreateConversation(userId)
        navigate(`/message?conv=${res.data.id}`)
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {counts && (
          <FollowButton userId={userId} initialIsFollowing={counts.isFollowing} onChange={onFollowChange} />
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/60 text-xs"
          onClick={handleMessage}
          disabled={loading}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Message
        </Button>
      </div>
      <AuthPromptDialog open={promptOpen} onOpenChange={setPromptOpen} />
    </>
  )
}