import { NavLink } from "react-router-dom"
import { navItems } from "./nav-items"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/useNotifications"

export default function MobileTabBar() {
  const { unreadCount } = useNotifications()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <div className="relative">
            <item.icon className="h-5 w-5" />
            {item.label === "Alerts" && unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}