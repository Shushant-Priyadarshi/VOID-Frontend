import { Home, Bell, PlusSquare, Stethoscope, MessageCircle } from "lucide-react"

export const navItems = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/mentor-find", label: "Mentors", icon: Stethoscope },
  { to: "/create-post", label: "Create", icon: PlusSquare },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/message", label: "Messages", icon: MessageCircle },
] as const