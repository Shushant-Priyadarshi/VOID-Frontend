import { Home, Search, PlusSquare, Stethoscope, MessageCircle } from "lucide-react"

export const navItems = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/create-post", label: "Create", icon: PlusSquare },
  { to: "/mentor-find", label: "Mentors", icon: Stethoscope },
  { to: "/message", label: "Messages", icon: MessageCircle },
] as const