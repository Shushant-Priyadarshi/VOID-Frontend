import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { SearchUser } from "@/types"

interface Props {
  user: SearchUser
}

export default function SearchUserCard({ user }: Props) {
  return (
    <Link to={`/u/${user.id}`}>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.profileImage ?? undefined} />
          <AvatarFallback>{user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user.college || user.hospital || user.bio || user.role}
          </p>
        </div>

        <Badge variant="secondary" className="shrink-0 text-xs">{user.role}</Badge>
      </div>
    </Link>
  )
}