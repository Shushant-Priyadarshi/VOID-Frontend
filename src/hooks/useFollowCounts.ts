import { useEffect, useState } from "react"
import { followApi } from "@/api/follow.api"
import type { FollowCounts } from "@/types"

export function useFollowCounts(userId: string) {
  const [counts, setCounts] = useState<FollowCounts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const res = await followApi.getCounts(userId)
        if (!cancelled) setCounts(res.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  return { counts, setCounts, loading }
}