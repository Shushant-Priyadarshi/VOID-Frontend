import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { Search } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"

export default function MobileTopBar() {
  const { data: session } = useSession()
  const { profile } = useProfile()
  const navigate = useNavigate()

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
          <span className="text-[10px] font-bold text-primary-foreground">V</span>
        </div>
        <span className="text-base font-bold tracking-tight">Void</span>
      </Link>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/search")}
        >
          <Search className="h-4 w-4" />
        </Button>

        <ModeToggle />

        {session ? (
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <AvatarImage src={profile?.profileImage ?? session.user.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {session.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button size="sm" onClick={() => navigate("/login")}>
            Log in
          </Button>
        )}
      </div>
    </header>
  )
}