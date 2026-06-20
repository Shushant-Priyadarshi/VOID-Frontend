import { useEffect, useState } from "react"
import { userApi } from "@/api/user.api"
import { postApi } from "@/api/post.api"
import type { PublicUserProfile, Post } from "@/types"

export function usePublicProfile(userId: string) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const [profileRes, postsRes] = await Promise.all([
          userApi.getPublicProfile(userId),
          postApi.getPostsByUser(userId),
        ])
        if (cancelled) return
        setProfile(profileRes.data)
        setPosts(postsRes.data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  return { profile, posts, setPosts, loading, error }
}