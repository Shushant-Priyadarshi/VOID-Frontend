import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types"

interface Props {
  profile: UserProfile
}

export default function ProfileHeader({ profile }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.profileImage ?? undefined} />
        <AvatarFallback className="text-xl">
          {profile.name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-lg font-semibold">{profile.name}</h1>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      {profile.bio && (
        <p className="max-w-sm text-sm text-muted-foreground">{profile.bio}</p>
      )}

      <Badge variant="secondary">{profile.role}</Badge>
    </div>
  )
}