import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"
import { followApi } from "@/api/follow.api"
import { useSession } from "@/lib/authClient"
import FollowButton from "./FollowButton"
import type { FollowUser } from "@/types"

interface Props {
  userId: string
  mode: "followers" | "following"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FollowListDialog({ userId, mode, open, onOpenChange }: Props) {
  const { data: session } = useSession()
  const [users, setUsers] = useState<FollowUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = mode === "followers"
          ? await followApi.getFollowers(userId)
          : await followApi.getFollowing(userId)
        if (cancelled) return
        setUsers(res.data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load list")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [open, userId, mode])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{mode === "followers" ? "Followers" : "Following"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-1">
            {loading && (
              <div className="flex flex-col gap-3 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            )}

            {error && <p className="py-4 text-sm text-destructive">{error}</p>}

            {!loading && !error && users.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {mode === "followers" ? "No followers yet." : "Not following anyone yet."}
              </p>
            )}

            {!loading && users.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 rounded-md px-1 py-2 hover:bg-accent">
                <Link
                  to={`/u/${u.id}`}
                  onClick={() => onOpenChange(false)}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.profileImage ?? undefined} />
                    <AvatarFallback>{u.name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.college || u.hospital || u.role}
                    </p>
                  </div>
                </Link>

                {session?.user.id !== u.id && (
                  <FollowButton userId={u.id} initialIsFollowing={u.isFollowedByMe} />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}