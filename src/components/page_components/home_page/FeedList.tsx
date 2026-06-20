import { useEffect, useState, useCallback } from "react"
import { postApi } from "@/api/post.api"
import PostCard from "./PostCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types"

export default function FeedList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await postApi.getFeed()
        if (cancelled) return
        setPosts(res.data)
        setHasMore(res.data.length === 10)
        setCursor(res.data.at(-1)?.id)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load feed")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const loadMore = useCallback(async () => {
    if (!cursor) return
    try {
      const res = await postApi.getFeed(cursor)
      setPosts((prev) => [...prev, ...res.data])
      setHasMore(res.data.length === 10)
      setCursor(res.data.at(-1)?.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more posts")
    }
  }, [cursor])

  function handleLikeToggle(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    )
    postApi.toggleLike(postId).catch(() => {
      // revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
            : p
        )
      )
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
      </div>
    )
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
      ))}

      {hasMore && (
        <Button variant="outline" onClick={loadMore}>
          Load more
        </Button>
      )}
    </div>
  )
}