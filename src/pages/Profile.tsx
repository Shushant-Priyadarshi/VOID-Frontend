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

export default function Profile() {
  const { profile, loading, error, updateProfile } = useUserProfile()
  const { counts } = useFollowCounts(profile?.id ?? "")
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null)
  const [mentorLoading, setMentorLoading] = useState(true)

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
  if (error) return <p className="text-center text-sm text-destructive">{error}</p>
  if (!profile) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 border-b pb-6 pt-2">
        <ProfileHeader profile={profile} onSave={updateProfile} />
        {counts && (
          <FollowStats userId={profile.id} followers={counts.followers} following={counts.following} />
        )}

        {!mentorLoading && (
          mentorProfile ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/mentor-find/manage">Manage mentor profile</Link>
            </Button>
          ) : (
            <BecomeMentorDialog onCreated={setMentorProfile} />
          )
        )}
      </div>
      <ProfilePostsTabs />
    </div>
  )
}