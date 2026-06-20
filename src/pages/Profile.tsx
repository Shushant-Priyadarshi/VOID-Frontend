import { useUserProfile } from "@/hooks/useUserProfile"
import ProfileHeader from "@/components/page_components/profile_page/ProfileHeader"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"
import ProfilePostsTabs from "@/components/page_components/profile_page/ProfilePostsTabs"

export default function Profile() {
  const { profile, loading, error, updateProfile } = useUserProfile()

  if (loading) return <ProfileSkeleton />

  if (error) {
    return <p className="text-center text-sm text-destructive">{error}</p>
  }

  if (!profile) return null

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader profile={profile} onSave={updateProfile} />
      <ProfilePostsTabs />
    </div>
  )
}