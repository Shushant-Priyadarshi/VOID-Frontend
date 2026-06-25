import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORY_LABELS } from "@/lib/mentorCategories"
import type { MentorProfile } from "@/types"

interface Props {
  mentor: MentorProfile
}

export default function MentorCard({ mentor }: Props) {
  return (
    <Link to={`/mentor-find/${mentor.userId}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="flex items-start gap-3 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.user.profileImage ?? undefined} />
            <AvatarFallback>{mentor.user.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{mentor.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{mentor.specialization}</p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="text-xs">
                {CATEGORY_LABELS[mentor.category]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {mentor.experienceYears}+ yrs exp
              </span>
            </div>

            {mentor.organization && (
              <p className="mt-1 truncate text-xs text-muted-foreground">{mentor.organization}</p>
            )}
          </div>

          {mentor.consultationFee !== null && (
            <span className="shrink-0 text-sm font-semibold">
              {mentor.consultationFee === 0 ? "Free" : `₹${mentor.consultationFee}`}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}