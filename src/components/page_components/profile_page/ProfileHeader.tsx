import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Building2 } from "lucide-react"
import type { UserProfile, UpdateProfileFn } from "@/types"
import EditProfileDialog from "./EditProfileDialog"
import { useSession } from "@/lib/authClient"

interface Props {
  profile: UserProfile
  onSave: UpdateProfileFn
}

const roleBadgeStyle: Record<string, string> = {
  MENTOR: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/60",
  ADMIN: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  USER: "bg-transparent text-muted-foreground border-border/60",
}

export default function ProfileHeader({ profile, onSave }: Props) {
  const session = useSession()

  return (
    <div className="-mt-10 flex flex-col gap-3">
      {/* Avatar — overlaps the cover strip */}
      <div className="flex items-end justify-between">
        <Avatar className="h-20 w-20 ring-4 ring-card shadow-md">
          <AvatarImage src={profile.profileImage || session.data?.user.image || undefined} />
          <AvatarFallback className="text-2xl font-semibold">
            {profile.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="mb-0.5">
          <EditProfileDialog profile={profile} onSave={onSave} />
        </div>
      </div>

      {/* Name + email */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">
            {profile.name}
          </h1>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium capitalize", roleBadgeStyle[profile.role] ?? roleBadgeStyle.USER)}
          >
            {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm leading-relaxed text-foreground/80 max-w-md">{profile.bio}</p>
      )}

      {/* Institution badges */}
      {(profile.college || profile.hospital) && (
        <div className="flex flex-wrap gap-2">
          {profile.college && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              {profile.college}
            </div>
          )}
          {profile.hospital && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              {profile.hospital}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}