import { Outlet } from "react-router-dom"
import DesktopSidebar from "./DesktopSidebar"
import MobileTabBar from "./MobileTabBar"
import MobileTopBar from "./MobileTopBar"

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MobileTopBar />
      <DesktopSidebar />

      <main className="min-h-screen w-full pb-16 pt-14 md:pb-0 md:pt-0 md:pl-60">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      <MobileTabBar />
    </div>
  )
}