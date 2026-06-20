import { useEffect, useState } from "react"
import { postApi } from "@/api/post.api"
import type { Post } from "@/types"

export type ProfileTab = "created" | "liked" | "commented"

const fetchers: Record<ProfileTab, () => Promise<{ data: Post[] }>> = {
  created: postApi.getMyPosts,
  liked: postApi.getMyLikedPosts,
  commented: postApi.getMyCommentedPosts,
}

export function useMyPostsTab(tab: ProfileTab) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await fetchers[tab]()
        if (cancelled) return
        setPosts(res.data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load posts")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [tab])

  return { posts, setPosts, loading, error }
}