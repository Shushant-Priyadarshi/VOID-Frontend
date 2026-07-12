import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { mentorApi } from "@/api/mentor.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, GraduationCap, Building2, Briefcase } from "lucide-react"
import { CATEGORY_LABELS } from "@/lib/mentorCategories"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import AuthPromptDialog from "@/components/common/AuthPromptDialog"
import FollowButton from "@/components/page_components/follow/FollowButton"
import FollowStats from "@/components/page_components/follow/FollowStats"
import { useFollowCounts } from "@/hooks/useFollowCounts"
import { useSession } from "@/lib/authClient"
import type { MentorProfile } from "@/types"
import { motion, useReducedMotion } from "framer-motion"
import { pageVariants } from "@/lib/animations"

export default function MentorProfile() {
  const { userId } = useParams<{ userId: string }>()
  if (!userId) return <p className="text-sm text-destructive">Invalid mentor URL</p>
  return <MentorProfileContent userId={userId} />
}

function MentorProfileContent({ userId }: { userId: string }) {
  const shouldReduce = useReducedMotion()
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

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="h-20 bg-muted" />
          <div className="px-5 pb-5">
            <div className="-mt-10 flex items-end justify-between">
              <Skeleton className="h-20 w-20 rounded-full ring-4 ring-card" />
              <Skeleton className="mb-0.5 h-8 w-24 rounded-md" />
            </div>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-4 w-56 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !mentor) {
    return <p className="py-8 text-center text-sm text-destructive">{error || "Mentor not found"}</p>
  }

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      {/* Hero card — matches own profile layout */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Cover strip with teal tint for mentors */}
        <div className="h-20 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-slate-900/60" />

        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar className="h-20 w-20 ring-4 ring-card shadow-md">
              <AvatarImage src={mentor.user.profileImage ?? undefined} />
              <AvatarFallback className="text-2xl font-semibold">
                {mentor.user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Booking CTA — primary action */}
            <div className="mb-0.5 flex flex-col items-end gap-1">
              <Button
                onClick={() => withAuth(() => console.log("Booking — cal.com pending"))}
                className="gap-2 bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
                size="sm"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Book a session
              </Button>
              {mentor.consultationFee !== null && (
                <p className="text-[11px] text-muted-foreground">
                  {mentor.consultationFee === 0 ? "Free" : `₹${mentor.consultationFee} / session`}
                </p>
              )}
            </div>
          </div>

          {/* Name + specialization */}
          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">{mentor.user.name}</h1>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                {CATEGORY_LABELS[mentor.category]}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{mentor.specialization}</p>
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              {mentor.experienceYears}+ years experience
            </span>
            {mentor.organization && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                {mentor.organization}
              </span>
            )}
            {mentor.user.college && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                {mentor.user.college}
              </span>
            )}
          </div>

          {/* Follow stats + follow button */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            {counts && (
              <FollowStats userId={userId} followers={counts.followers} following={counts.following} />
            )}
            {session?.user.id !== userId && counts && (
              <FollowButton
                userId={userId}
                initialIsFollowing={counts.isFollowing}
                onChange={(isFollowing) =>
                  setCounts((prev) =>
                    prev ? { ...prev, followers: isFollowing ? prev.followers + 1 : prev.followers - 1, isFollowing } : prev
                  )
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* About sections */}
      {mentor.about && (
        <div className="rounded-xl border bg-card px-5 py-4">
          <h2 className="mb-2 text-sm font-semibold text-foreground">About mentorship</h2>
          <p className="text-sm leading-relaxed text-foreground/80">{mentor.about}</p>
        </div>
      )}

      {mentor.user.bio && (
        <div className="rounded-xl border bg-card px-5 py-4">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Bio</h2>
          <p className="text-sm leading-relaxed text-foreground/80">{mentor.user.bio}</p>
        </div>
      )}

      <AuthPromptDialog open={promptOpen} onOpenChange={setPromptOpen} />
    </motion.div>
  )
}