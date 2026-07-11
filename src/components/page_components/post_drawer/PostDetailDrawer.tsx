import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { postApi } from "@/api/post.api"
import { usePostDrawer } from "@/hooks/usePostDrawer"
import PostCard from "@/components/page_components/home_page/PostCard"
import CommentItem from "./CommentItem"
import CommentComposer from "./CommentComposer"
import type { Post, Comment } from "@/types"
import { MessageCircle } from "lucide-react"

export default function PostDetailDrawer() {
  const { openPostId, closePost } = usePostDrawer()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isOpen = !!openPostId

  useEffect(() => {
    if (!openPostId) {
      setPost(null)
      setComments([])
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await postApi.getPostById(openPostId!)
        if (cancelled) return
        setPost(res.data.post)
        setComments(res.data.comments)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load post")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [openPostId])

  function handleLikeToggle(postId: string) {
    setPost((prev) =>
      prev && prev.id === postId
        ? { ...prev, likedByMe: !prev.likedByMe, likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1 }
        : prev
    )
    postApi.toggleLike(postId).catch(() => {
      setPost((prev) =>
        prev && prev.id === postId
          ? { ...prev, likedByMe: !prev.likedByMe, likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1 }
          : prev
      )
    })
  }

  function handleTopLevelComment(comment: Comment) {
    setComments((prev) => [...prev, comment])
  }

  function handleReplyAdded(parentId: string, reply: Comment) {
    setComments((prev) => addReplyToTree(prev, parentId, reply))
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closePost()}>
      <DrawerContent className="mx-auto h-[92vh] max-w-2xl focus:outline-none">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{post?.title ?? "Post"}</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-auto">
          {loading && (
            <div className="flex flex-col gap-3 p-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
                    <Skeleton className="h-3.5 w-28 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-5/6 rounded" />
                </div>
              </div>
              <div className="flex flex-col gap-2 px-1">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4 rounded-lg" />
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {!loading && post && (
            <div className="flex flex-col pb-10">
              {/* Post */}
              <div className="p-4">
                <PostCard post={post} onLikeToggle={handleLikeToggle} truncate={false} />
              </div>

              {/* Comments section */}
              <div className="border-t border-border/60 px-4 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {comments.length > 0 ? `${comments.length} comment${comments.length === 1 ? "" : "s"}` : "Comments"}
                  </h2>
                </div>

                <CommentComposer postId={post.id} onSubmitted={handleTopLevelComment} />

                {comments.length > 0 ? (
                  <div className="mt-4 flex flex-col gap-0.5">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={post.id}
                        onReplyAdded={handleReplyAdded}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs text-muted-foreground">
                      No comments yet. Be the first to share your thoughts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

function addReplyToTree(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, reply] }
    if (c.replies.length > 0) return { ...c, replies: addReplyToTree(c.replies, parentId, reply) }
    return c
  })
}