import { useUserProfile } from "@/hooks/useUserProfile"
import { useFollowCounts } from "@/hooks/useFollowCounts"
import { useEffect, useState } from "react"
import { mentorApi } from "@/api/mentor.api"
import ProfileHeader from "@/components/page_components/profile_page/ProfileHeader"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"
import ProfilePostsTabs from "@/components/page_components/profile_page/ProfilePostsTabs"
import FollowStats from "@/components/page_components/follow/FollowStats"
import BecomeMentorDialog from "@/components/page_components/profile_page/BecomeMentorDialog"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import type { MentorProfile } from "@/types"
import { motion, useReducedMotion } from "framer-motion"
import { pageVariants } from "@/lib/animations"
import { Stethoscope } from "lucide-react"

export default function Profile() {
  const { profile, loading, error, updateProfile } = useUserProfile()
  const { counts } = useFollowCounts(profile?.id ?? "")
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null)
  const [mentorLoading, setMentorLoading] = useState(true)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    mentorApi.getMyMentorProfile()
      .then((res) => { if (!cancelled) setMentorProfile(res.data) })
      .catch(() => { if (!cancelled) setMentorProfile(null) })
      .finally(() => { if (!cancelled) setMentorLoading(false) })
    return () => { cancelled = true }
  }, [profile])

  if (loading) return <ProfileSkeleton />
  if (error) return <p className="py-8 text-center text-sm text-destructive">{error}</p>
  if (!profile) return null

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-0"
    >
      {/* Profile header card */}
      <div className="relative rounded-xl border bg-card overflow-hidden">
        {/* Subtle cover strip */}
        <div className="h-20 bg-gradient-to-r from-slate-100 to-slate-200/50 dark:from-slate-800/60 dark:to-slate-900/60" />

        <div className="px-5 pb-5">
          <ProfileHeader profile={profile} onSave={updateProfile} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            {counts && (
              <FollowStats
                userId={profile.id}
                followers={counts.followers}
                following={counts.following}
              />
            )}

            {!mentorLoading && (
              <div className="ml-auto">
                {mentorProfile ? (
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Link to="/mentor-find/manage">
                      <Stethoscope className="h-3.5 w-3.5" />
                      Mentor profile
                    </Link>
                  </Button>
                ) : (
                  <BecomeMentorDialog onCreated={setMentorProfile} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts tabs */}
      <div className="mt-5">
        <ProfilePostsTabs />
      </div>
    </motion.div>
  )
}