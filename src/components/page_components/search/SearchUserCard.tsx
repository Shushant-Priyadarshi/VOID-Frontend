import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { SearchUser } from "@/types"
import { GraduationCap, Building2 } from "lucide-react"

interface Props {
  user: SearchUser
}

const roleStyles: Record<string, string> = {
  MENTOR: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/60",
  ADMIN: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  USER: "bg-muted text-muted-foreground border border-border/60",
}

export default function SearchUserCard({ user }: Props) {
  return (
    <Link to={`/u/${user.id}`}>
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:border-border hover:bg-muted/30">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={user.profileImage ?? undefined} />
          <AvatarFallback className="text-sm font-semibold">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            {user.college && (
              <>
                <GraduationCap className="h-3 w-3 shrink-0" />
                <span className="truncate">{user.college}</span>
              </>
            )}
            {!user.college && user.hospital && (
              <>
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{user.hospital}</span>
              </>
            )}
            {!user.college && !user.hospital && user.bio && (
              <span className="truncate">{user.bio}</span>
            )}
          </div>
        </div>

        <span className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
          roleStyles[user.role] ?? roleStyles.USER
        )}>
          {user.role === "MENTOR" ? "Mentor" : user.role === "ADMIN" ? "Admin" : "Member"}
        </span>
      </div>
    </Link>
  )
}