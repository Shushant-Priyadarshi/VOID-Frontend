import { useUserProfile } from "@/hooks/useUserProfile"
import { useFollowCounts } from "@/hooks/useFollowCounts"
import ProfileHeader from "@/components/page_components/profile_page/ProfileHeader"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"
import ProfilePostsTabs from "@/components/page_components/profile_page/ProfilePostsTabs"
import FollowStats from "@/components/page_components/follow/FollowStats"

export default function Profile() {
  const { profile, loading, error, updateProfile } = useUserProfile()
  const { counts } = useFollowCounts(profile?.id ?? "")

  if (loading) return <ProfileSkeleton />

  if (error) {
    return <p className="text-center text-sm text-destructive">{error}</p>
  }

  if (!profile) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 border-b pb-6 pt-2">
        <ProfileHeader profile={profile} onSave={updateProfile} />
        {counts && (
          <FollowStats userId={profile.id} followers={counts.followers} following={counts.following} />
        )}
      </div>
      <ProfilePostsTabs />
    </div>
  )
}