import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { postApi } from "@/api/post.api"
import type { Comment } from "@/types"

interface Props {
  postId: string
  parentId?: string
  autoFocus?: boolean
  onSubmitted: (comment: Comment) => void
}

export default function CommentComposer({ postId, parentId, autoFocus, onSubmitted }: Props) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await postApi.addComment(postId, content.trim(), parentId)
      onSubmitted({ ...res.data, replies: [] })
      setContent("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        autoFocus={autoFocus}
        placeholder={parentId ? "Write a reply..." : "Add a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        className="resize-none text-sm"
      />
      <Button size="sm" className="self-end" disabled={loading || !content.trim()} onClick={handleSubmit}>
        {loading ? "Posting..." : parentId ? "Reply" : "Comment"}
      </Button>
    </div>
  )
}