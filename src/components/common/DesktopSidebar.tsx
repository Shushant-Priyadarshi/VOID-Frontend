import { NavLink, Link, useNavigate } from "react-router-dom"
import { navItems } from "./nav-items"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/ui/theme-provider"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Sun, Moon, Monitor, ChevronUp } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useNotifications } from "@/hooks/useNotifications"
import { useMessageContext } from "@/hooks/useMessageContext"

export default function DesktopSidebar() {
  const { data: session } = useSession()
  const { profile } = useProfile()
  const { setTheme, theme } = useTheme()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()
  const { totalUnread } = useMessageContext()

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col md:border-r md:bg-background">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
              <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight">Void</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const badge =
            item.label === "Alerts" ? unreadCount
            : item.label === "Messages" ? totalUnread
            : 0

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-teal-600 dark:text-teal-400" : "text-current"
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : isActive ? (
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  ) : null}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* User section */}
      <div className="shrink-0 border-t px-3 py-3">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={profile?.profileImage ?? session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs font-medium">
                    {session.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">{session.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === "dark" ? <Moon className="mr-2 h-4 w-4" />
                    : theme === "light" ? <Sun className="mr-2 h-4 w-4" />
                    : <Monitor className="mr-2 h-4 w-4" />}
                  Appearance
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => setTheme(value as "light" | "dark" | "system")}
                      className={cn(theme === value && "text-teal-600 dark:text-teal-400")}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                      {theme === value && <span className="ml-auto text-xs">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate("/login")}
              className="h-9 bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              Sign in
            </Button>
            <Button variant="outline" onClick={() => navigate("/signup")} className="h-9 border-border/60">
              Create account
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}