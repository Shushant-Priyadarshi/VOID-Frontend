import { useEffect, useState } from "react"
import {  useParams } from "react-router-dom"
import { postApi } from "@/api/post.api"
import PostCard from "@/components/page_components/home_page/PostCard"
import CommentItem from "@/components/page_components/post_detail/CommentItem"
import CommentComposer from "@/components/page_components/post_detail/CommentComposer"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { Post, Comment } from "@/types"

export default function DetailPost() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <p className="text-sm text-destructive">Invalid post URL</p>
  }

  return <DetailPostContent postId={id} />
}

function DetailPostContent({ postId }: { postId: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await postApi.getPostById(postId)
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
  }, [postId])

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

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    )
  }

  if (error || !post) {
    return <p className="text-sm text-destructive">{error || "Post not found"}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <PostCard post={post} onLikeToggle={handleLikeToggle} />

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
  )
}

function addReplyToTree(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...c.replies, reply] }
    }
    if (c.replies.length > 0) {
      return { ...c, replies: addReplyToTree(c.replies, parentId, reply) }
    }
    return c
  })
}