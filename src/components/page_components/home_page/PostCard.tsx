import { useState } from "react"
import { Heart, MessageCircle, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Post } from "@/types"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { Link } from "react-router-dom"
import { formatRelativeTime } from "@/lib/formatRelativeTime"
import { truncateWords } from "@/lib/truncateWords"
import AuthPromptDialog from "@/components/common/AuthPromptDialog"
import PostImageGrid from "./PostImageGrid"
import ImageLightbox from "./ImageLightbox"
import { usePostDrawer } from "@/hooks/usePostDrawer"

interface Props {
  post: Post
  onLikeToggle: (postId: string) => void
  truncate?: boolean
}

export default function PostCard({ post, onLikeToggle, truncate = true }: Props) {
  const { withAuth, promptOpen, setPromptOpen } = useRequireAuth()
  const { openPost } = usePostDrawer()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const { text: truncatedContent, isTruncated } = truncate
    ? truncateWords(post.content, 30)
    : { text: post.content, isTruncated: false }

  function handlePostClick() {
    withAuth(() => openPost(post.id))
  }

  function handleImageClick(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <article className="rounded-lg border bg-card p-4 transition-colors">
      <div className="flex items-start gap-3">
        {post.isAnonymous ? (
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-muted">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link to={`/u/${post.author?.id}`} onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-9 w-9 transition-opacity hover:opacity-80">
              <AvatarImage src={post.author?.profileImage ?? undefined} />
              <AvatarFallback>{post.author?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        )}

        <div className="min-w-0 flex-1">
          {post.isAnonymous ? (
            <p className="text-sm font-medium leading-tight">Anonymous</p>
          ) : (
            <Link
              to={`/u/${post.author?.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium leading-tight hover:underline"
            >
              {post.author?.name}
            </Link>
          )}
          <p className="text-xs text-muted-foreground">
            {post.isAnonymous ? post.anonymousLabel : formatRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>

      <div
        onClick={truncate ? handlePostClick : undefined}
        className={cn("mt-3", truncate && "cursor-pointer")}
      >
        <h3 className="font-bold leading-snug">{post.title}</h3>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
          {truncatedContent}
          {isTruncated && (
            <span className="ml-1 font-medium text-primary">Read more</span>
          )}
        </p>
      </div>

      {!post.isAnonymous && post.imageUrls.length > 0 && (
        <PostImageGrid
          imageUrls={post.imageUrls}
          onImageClick={handleImageClick}
          size={truncate ? "compact" : "full"}
        />
      )}

      <div className="mt-4 flex items-center gap-4 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 gap-1.5 px-2", post.likedByMe && "text-rose-500")}
          onClick={() => withAuth(() => onLikeToggle(post.id))}
        >
          <Heart className={cn("h-4 w-4", post.likedByMe && "fill-current")} />
          {post.likeCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2"
          onClick={handlePostClick}
        >
          <MessageCircle className="h-4 w-4" />
          {post.commentCount}
        </Button>
      </div>

      <AuthPromptDialog open={promptOpen} onOpenChange={setPromptOpen} />

      {post.imageUrls.length > 0 && (
        <ImageLightbox
          imageUrls={post.imageUrls}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      )}
    </article>
  )
}