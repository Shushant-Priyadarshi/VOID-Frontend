import { useEffect, useState, useCallback } from "react"
import { userApi } from "@/api/user.api"
import type { UserProfile, UpdateProfilePayload } from "@/types"

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await userApi.getProfile()
      setProfile(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await userApi.getProfile()
        if (cancelled) return
        setProfile(res.data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  async function updateProfile(payload: UpdateProfilePayload) {
    const res = await userApi.updateProfile(payload)
    setProfile(res.data)
    return res.data
  }

  return { profile, loading, error, refetch: fetchProfile, updateProfile }
}