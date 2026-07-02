import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { postApi } from "@/api/post.api"
import { usePostDrawer } from "@/hooks/usePostDrawer"
import PostCard from "@/components/page_components/home_page/PostCard"
import CommentItem from "./CommentItem"
import CommentComposer from "./CommentComposer"
import type { Post, Comment } from "@/types"

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
        ? {
            ...prev,
            likedByMe: !prev.likedByMe,
            likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1,
          }
        : prev
    )
    postApi.toggleLike(postId).catch(() => {
      setPost((prev) =>
        prev && prev.id === postId
          ? {
              ...prev,
              likedByMe: !prev.likedByMe,
              likeCount: prev.likedByMe ? prev.likeCount - 1 : prev.likeCount + 1,
            }
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
      <DrawerContent className="mx-auto h-[92vh] max-w-2xl">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{post?.title ?? "Post"}</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-auto px-4 pb-8">
          {loading && (
            <div className="flex flex-col gap-3 py-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4 rounded-lg" />
            </div>
          )}

          {error && (
            <p className="py-4 text-center text-sm text-destructive">{error}</p>
          )}

          {!loading && post && (
            <div className="flex flex-col gap-4 py-2">
              <PostCard post={post} onLikeToggle={handleLikeToggle} truncate={false} />

              <Separator />

              <div>
                <h2 className="mb-3 text-sm font-semibold">
                  Comments {comments.length > 0 && `(${comments.length})`}
                </h2>

                <CommentComposer postId={post.id} onSubmitted={handleTopLevelComment} />

                <div className="mt-4 flex flex-col">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      onReplyAdded={handleReplyAdded}
                    />
                  ))}
                </div>
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