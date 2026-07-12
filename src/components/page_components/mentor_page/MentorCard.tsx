import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CATEGORY_LABELS } from "@/lib/mentorCategories"
import type { MentorProfile } from "@/types"
import { Building2, Clock } from "lucide-react"

interface Props {
  mentor: MentorProfile
}

export default function MentorCard({ mentor }: Props) {
  return (
    <Link to={`/mentor-find/${mentor.userId}`}>
      <article className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-muted/20">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={mentor.user.profileImage ?? undefined} />
          <AvatarFallback className="text-sm font-semibold">
            {mentor.user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{mentor.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{mentor.specialization}</p>
            </div>

            {mentor.consultationFee !== null && (
              <span className="shrink-0 text-sm font-bold text-foreground">
                {mentor.consultationFee === 0 ? (
                  <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs">Free</span>
                ) : (
                  `₹${mentor.consultationFee}`
                )}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
              {CATEGORY_LABELS[mentor.category]}
            </span>

            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {mentor.experienceYears}+ yrs
            </span>

            {mentor.organization && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{mentor.organization}</span>
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}