
import { GraduationCap, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PublicUserProfile } from "@/types"

interface Props {
  profile: PublicUserProfile
}

const roleBadgeStyle: Record<string, string> = {
  MENTOR: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/60",
  ADMIN: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  USER: "bg-transparent text-muted-foreground border border-border/60",
}

export default function PublicProfileHeader({ profile }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold tracking-tight text-foreground">{profile.name}</h1>
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize border",
          roleBadgeStyle[profile.role] ?? roleBadgeStyle.USER
        )}>
          {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}
        </span>
      </div>

      {profile.bio && (
        <p className="text-sm leading-relaxed text-foreground/80">{profile.bio}</p>
      )}

      {(profile.college || profile.hospital) && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {profile.college && (
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> {profile.college}
            </span>
          )}
          {profile.hospital && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> {profile.hospital}
            </span>
          )}
        </div>
      )}
    </div>
  )
}