import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSession, signOut } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Sun, Moon, Monitor, User, LogOut } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { useTheme } from "@/components/ui/theme-provider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function MobileTopBar() {
  const { data: session } = useSession()
  const { profile } = useProfile()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut()
    navigate("/login")
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-600">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
              <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
            </svg>
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

          {session ? (
            <button onClick={() => setMenuOpen(true)} className="ml-1">
              <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all hover:ring-teal-500/30">
                <AvatarImage src={profile?.profileImage ?? session.user.image ?? undefined} />
                <AvatarFallback className="text-xs font-medium">
                  {session.user.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Button
              size="sm"
              className="h-8 bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          )}
        </div>
      </header>

      {/* Mobile user menu sheet */}
      {session && (
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl pb-safe">
            <SheetHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={profile?.profileImage ?? session.user.image ?? undefined} />
                  <AvatarFallback className="text-sm font-semibold">
                    {session.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <SheetTitle className="text-sm font-semibold leading-tight">
                    {session.user.name}
                  </SheetTitle>
                  <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-1">
              {/* View profile */}
              <button
                onClick={() => { navigate("/profile"); setMenuOpen(false) }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                View profile
              </button>

              {/* Theme section */}
              <div className="my-1.5 border-t border-border/60" />
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Appearance
              </p>

              <div className="flex gap-1 px-2">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value as "light" | "dark" | "system")}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1.5 rounded-lg py-2.5 text-[11px] font-medium transition-colors",
                      theme === value
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="my-1.5 border-t border-border/60" />

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}