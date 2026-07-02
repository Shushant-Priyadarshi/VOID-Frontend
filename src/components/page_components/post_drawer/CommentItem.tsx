import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import type { Comment } from "@/types"
import CommentComposer from "../post_drawer/CommentComposer"

interface Props {
  comment: Comment
  postId: string
  onReplyAdded: (parentId: string, reply: Comment) => void
  depth?: number
}

export default function CommentItem({ comment, postId, onReplyAdded, depth = 0 }: Props) {
  const [replying, setReplying] = useState(false)

  return (
    <div className={depth > 0 ? "ml-6 border-l pl-4" : ""}>
      <div className="flex gap-2.5 py-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={comment.author.profileImage ?? undefined} />
          <AvatarFallback className="text-xs">
            {comment.author.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="rounded-lg bg-muted px-3 py-2">
            <p className="text-xs font-medium">{comment.author.name}</p>
            <p className="text-sm">{comment.content}</p>
          </div>

          <div className="mt-1 flex items-center gap-3 px-1">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
            <button
              onClick={() => setReplying((r) => !r)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Reply
            </button>
          </div>

          {replying && (
            <div className="mt-2">
              <CommentComposer
                postId={postId}
                parentId={comment.id}
                autoFocus
                onSubmitted={(reply) => {
                  onReplyAdded(comment.id, reply)
                  setReplying(false)
                }}
              />
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-1">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  onReplyAdded={onReplyAdded}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}