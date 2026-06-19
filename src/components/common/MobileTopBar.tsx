import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"

export default function MobileTopBar() {
  const { data: session } = useSession()
  const navigate = useNavigate()

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
      <Link to="/" className="text-lg font-bold tracking-tight">Void</Link>

      <div className="flex items-center gap-2">
        <ModeToggle />
        {session ? (
          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate("/profile")}>
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>{session.user.name?.[0]?.toUpperCase()}</AvatarFallback>
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