import { Link, NavLink } from "react-router-dom"
import { navItems } from "./nav-items"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/authClient"
import { useProfile } from "@/context/useProfile"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function DesktopSidebar() {
  const { data: session } = useSession()
  const { profile } = useProfile()
  const navigate = useNavigate()

  async function handleSignOut() {
    const confirm = window.confirm("Do you want to logout")
    if (confirm) {
      await signOut()
      navigate("/login")
    }
  }

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col md:justify-between md:border-r md:px-3 md:py-6">
      <div className="flex flex-col gap-1">
        <div className="mb-6 px-3 text-xl font-bold tracking-tight">
          <Link to="/">Void</Link>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-center justify-between px-2">
          <ModeToggle />
        </div>

        {session ? (
          <div className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent">
            <Link className="cursor-pointer" to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.profileImage ?? session.user.image ?? undefined} />
                <AvatarFallback>
                  {session.user.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <span className="flex-1 truncate text-sm font-medium">
              {session.user.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-2">
            <Button onClick={() => navigate("/login")}>Log in</Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}