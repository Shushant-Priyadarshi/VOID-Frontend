import { useState } from "react"
import { Heart, MessageCircle, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    <article className="group rounded-xl border border-border/60 bg-card transition-colors hover:border-border">
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-start gap-2.5">
          {post.isAnonymous ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <Link to={`/u/${post.author?.id}`} onClick={(e) => e.stopPropagation()}>
              <Avatar className="h-9 w-9 shrink-0 transition-opacity hover:opacity-80">
                <AvatarImage src={post.author?.profileImage ?? undefined} />
                <AvatarFallback className="text-xs font-medium">
                  {post.author?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          <div className="min-w-0 flex-1">
            {post.isAnonymous ? (
              <p className="text-sm font-semibold leading-tight text-foreground">Anonymous</p>
            ) : (
              <Link
                to={`/u/${post.author?.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-semibold leading-tight text-foreground hover:underline underline-offset-2"
              >
                {post.author?.name}
              </Link>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground/70 leading-none">
              {post.isAnonymous ? post.anonymousLabel : formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div
          onClick={truncate ? handlePostClick : undefined}
          className={cn("mt-3", truncate && "cursor-pointer")}
        >
          <h3 className="text-sm font-bold leading-snug tracking-tight text-foreground">
            {post.title}
          </h3>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
            {truncatedContent}
            {isTruncated && (
              <button
                onClick={handlePostClick}
                className="ml-1 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Read more
              </button>
            )}
          </p>
        </div>

        {/* Images */}
        {!post.isAnonymous && post.imageUrls.length > 0 && (
          <PostImageGrid
            imageUrls={post.imageUrls}
            onImageClick={handleImageClick}
            size={truncate ? "compact" : "full"}
          />
        )}

        {/* Action bar */}
        <div className="mt-3 flex items-center gap-0.5 border-t border-border/40 pt-3">
          <button
            onClick={() => withAuth(() => onLikeToggle(post.id))}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              post.likedByMe
                ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Heart className={cn("h-4 w-4", post.likedByMe && "fill-current")} />
            <span className="tabular-nums">{post.likeCount}</span>
          </button>

          <button
            onClick={handlePostClick}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="tabular-nums">{post.commentCount}</span>
          </button>
        </div>
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