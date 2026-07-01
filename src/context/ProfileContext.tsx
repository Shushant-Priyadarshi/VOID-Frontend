import { createContext, useEffect, useState, useCallback,type ReactNode } from "react"
import { useSession } from "@/lib/authClient"
import { userApi } from "@/api/user.api"
import type { UserProfile, UpdateProfilePayload } from "@/types"

export interface ProfileContextValue {
  profile: UserProfile | null
  loading: boolean
  error: string
  refetch: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserProfile>
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()
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
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // still waiting to know auth state — don't fetch or clear yet
    if (isPending) return

    if (!session) {
      // nothing to synchronize with an external system here —
      // just bail without touching state synchronously
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await userApi.getProfile()
        if (!cancelled) setProfile(res.data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [session, isPending])

  async function updateProfile(payload: UpdateProfilePayload) {
    const res = await userApi.updateProfile(payload)
    setProfile(res.data)
    return res.data
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refetch: fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}