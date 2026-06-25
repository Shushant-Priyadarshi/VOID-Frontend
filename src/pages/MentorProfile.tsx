import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { mentorApi } from "@/api/mentor.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, GraduationCap, Hospital, Briefcase } from "lucide-react"
import { CATEGORY_LABELS } from "@/lib/mentorCategories"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import AuthPromptDialog from "@/components/common/AuthPromptDialog"
import FollowButton from "@/components/page_components/follow/FollowButton"
import { useFollowCounts } from "@/hooks/useFollowCounts"
import { useSession } from "@/lib/authClient"
import type { MentorProfile } from "@/types"

export default function MentorProfilePage() {
  const { userId } = useParams<{ userId: string }>()

  if (!userId) {
    return <p className="text-sm text-destructive">Invalid mentor URL</p>
  }

  return <MentorProfileContent userId={userId} />
}

function MentorProfileContent({ userId }: { userId: string }) {
  const [mentor, setMentor] = useState<MentorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { withAuth, promptOpen, setPromptOpen } = useRequireAuth()
  const { counts, setCounts } = useFollowCounts(userId)
  const { data: session } = useSession()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await mentorApi.getMentorByUserId(userId)
        if (!cancelled) setMentor(res.data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Mentor not found")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  function handleBookingClick() {
    withAuth(() => {
      // TODO: integrate cal.com booking link/embed here
      console.log("Open booking flow — cal.com integration pending")
    })
  }

  function handleFollowChange(isFollowing: boolean) {
    setCounts((prev) =>
      prev ? { ...prev, followers: isFollowing ? prev.followers + 1 : prev.followers - 1, isFollowing } : prev
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    )
  }

  if (error || !mentor) {
    return <p className="text-center text-sm text-destructive">{error || "Mentor not found"}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 border-b pb-6 pt-2 text-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={mentor.user.profileImage ?? undefined} />
          <AvatarFallback className="text-xl">{mentor.user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-lg font-semibold">{mentor.user.name}</h1>
          <p className="text-sm text-muted-foreground">{mentor.specialization}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">{CATEGORY_LABELS[mentor.category]}</Badge>
          <Badge variant="outline" className="gap-1">
            <Briefcase className="h-3 w-3" />
            {mentor.experienceYears}+ years experience
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {mentor.user.college && (
            <Badge variant="outline" className="gap-1">
              <GraduationCap className="h-3 w-3" />
              {mentor.user.college}
            </Badge>
          )}
          {(mentor.organization || mentor.user.hospital) && (
            <Badge variant="outline" className="gap-1">
              <Hospital className="h-3 w-3" />
              {mentor.organization || mentor.user.hospital}
            </Badge>
          )}
        </div>

        {counts && session?.user.id !== userId && (
          <FollowButton userId={userId} initialIsFollowing={counts.isFollowing} onChange={handleFollowChange} />
        )}

        <div className="mt-2 flex w-full max-w-xs flex-col items-center gap-1">
          <Button onClick={handleBookingClick} className="w-full gap-2">
            <CalendarDays className="h-4 w-4" />
            Book a session
          </Button>
          {mentor.consultationFee !== null && (
            <p className="text-xs text-muted-foreground">
              {mentor.consultationFee === 0 ? "Free session" : `₹${mentor.consultationFee} per session`}
            </p>
          )}
        </div>
      </div>

      {mentor.about && (
        <div>
          <h2 className="mb-2 text-sm font-semibold">About mentorship</h2>
          <p className="text-sm text-muted-foreground">{mentor.about}</p>
        </div>
      )}

      {mentor.user.bio && (
        <div>
          <h2 className="mb-2 text-sm font-semibold">Bio</h2>
          <p className="text-sm text-muted-foreground">{mentor.user.bio}</p>
        </div>
      )}

      <AuthPromptDialog open={promptOpen} onOpenChange={setPromptOpen} />
    </div>
  )
}