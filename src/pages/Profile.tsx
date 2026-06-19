import { useUserProfile } from "@/hooks/useUserProfile"
import ProfileHeader from "@/components/page_components/profile_page/ProfileHeader"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"

export default function Profile() {
  const { profile, loading, error } = useUserProfile()

  if (loading) return <ProfileSkeleton />

  if (error) {
    return <p className="text-center text-sm text-destructive">{error}</p>
  }

  if (!profile) return null
  console.log(profile)

  return <ProfileHeader profile={profile} />
}