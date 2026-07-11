import { NavLink } from "react-router-dom"
import { navItems } from "./nav-items"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/useNotifications"
import { useMessageContext } from "@/hooks/useMessageContext"

export default function MobileTabBar() {
  const { unreadCount } = useNotifications()
  const { totalUnread } = useMessageContext()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background/95 backdrop-blur md:hidden">
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
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                isActive ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                  {badge > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[9px] font-bold text-white">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}