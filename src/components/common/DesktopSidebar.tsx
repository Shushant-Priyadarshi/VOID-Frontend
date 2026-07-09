import { NavLink, Link, useNavigate } from "react-router-dom";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronRight, Sun, Moon, Monitor } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";

export default function DesktopSidebar() {
  const { data: session } = useSession();
  const { profile } = useProfile();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col md:border-r md:bg-background">
      {/* Top — logo */}
      <div className="flex h-16 items-center border-b px-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">V</span>
          </div>
          <span className="text-base font-bold tracking-tight">Void</span>
        </Link>
      </div>

      {/* Middle — nav items only */}
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive && "text-primary",
                  )}
                />
                {item.label}
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary" />
                )}
                {item.label === "Alerts" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom — user section */}
      <div className="border-t px-3 py-3">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage
                    src={
                      profile?.profileImage ?? session.user.image ?? undefined
                    }
                  />
                  <AvatarFallback className="text-xs">
                    {session.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === "dark" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : theme === "light" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Monitor className="mr-2 h-4 w-4" />
                  )}
                  Appearance
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className={cn(theme === "light" && "text-primary")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {theme === "light" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className={cn(theme === "dark" && "text-primary")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {theme === "dark" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className={cn(theme === "system" && "text-primary")}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                    {theme === "system" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/login")}>Log in</Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
