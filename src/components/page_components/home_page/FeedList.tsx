import { useEffect, useState, useCallback } from "react"
import { postApi } from "@/api/post.api"
import PostCard from "./PostCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types"
import { motion, useReducedMotion } from "framer-motion"
import { listVariants, itemVariants } from "@/lib/animations"
import { RefreshCw } from "lucide-react"

function PostCardSkeleton() {
  return (
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
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-7 w-14 rounded-md" />
        <Skeleton className="h-7 w-14 rounded-md" />
      </div>
    </div>
  )
}

export default function FeedList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const shouldReduce = useReducedMotion()

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
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await postApi.getFeed(cursor)
      setPosts((prev) => [...prev, ...res.data])
      setHasMore(res.data.length === 10)
      setCursor(res.data.at(-1)?.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more posts")
    } finally {
      setLoadingMore(false)
    }
  }, [cursor, loadingMore])

  function handleLikeToggle(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    )
    postApi.toggleLike(postId).catch(() => {
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
        {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Nothing here yet</p>
        <p className="text-xs text-muted-foreground">Be the first to share something with the community.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={shouldReduce ? {} : listVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-3"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={shouldReduce ? {} : itemVariants}>
          <PostCard post={post} onLikeToggle={handleLikeToggle} />
        </motion.div>
      ))}

      {hasMore && (
        <Button
          variant="outline"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-1 h-9 w-full border-border/60 text-sm text-muted-foreground hover:text-foreground"
        >
          {loadingMore ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Loading…
            </span>
          ) : (
            "Load more"
          )}
        </Button>
      )}
    </motion.div>
  )
}