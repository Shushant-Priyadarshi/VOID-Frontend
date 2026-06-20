import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import PostCard from "@/components/page_components/home_page/PostCard"
import type { Post } from "@/types"

interface Props {
  post: Post
  onLikeToggle: (postId: string) => void
  onDelete?: (postId: string) => void
}

export default function MyPostCard({ post, onLikeToggle, onDelete }: Props) {
  return (
    <div className="relative">
      <PostCard post={post} onLikeToggle={onLikeToggle} />
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(post.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}