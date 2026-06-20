import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Hospital } from "lucide-react"
import type { PublicUserProfile } from "@/types"

interface Props {
  profile: PublicUserProfile
}

export default function PublicProfileHeader({ profile }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 border-b pb-6 pt-2 text-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.profileImage ?? undefined} />
        <AvatarFallback className="text-xl">
          {profile.name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-lg font-semibold">{profile.name}</h1>
      </div>

      {profile.bio && (
        <p className="max-w-sm text-sm text-muted-foreground">{profile.bio}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="secondary">{profile.role}</Badge>

        {profile.college && (
          <Badge variant="outline" className="gap-1">
            <GraduationCap className="h-3 w-3" />
            {profile.college}
          </Badge>
        )}

        {profile.hospital && (
          <Badge variant="outline" className="gap-1">
            <Hospital className="h-3 w-3" />
            {profile.hospital}
          </Badge>
        )}
      </div>
    </div>
  )
}