import { Outlet } from "react-router-dom"
import DesktopSidebar from "./DesktopSidebar"
import MobileTabBar from "./MobileTabBar"
import MobileTopBar from "./MobileTopBar"
import PostDetailDrawer from "../page_components/post_drawer/PostDetailDrawer"
import DesktopSearchPanel from "./DesktopSearchPanel"


export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MobileTopBar />
      <DesktopSidebar />

      {/*
        On desktop: sidebar is fixed left (w-60), search panel is fixed right (w-72).
        Main content sits between them with matching left/right offsets.
        On mobile: full width, no offsets.
      */}
      <main className="min-h-screen w-full pb-16 pt-14 md:pb-0 md:pl-60 md:pr-72 md:pt-0">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      <DesktopSearchPanel />
      <MobileTabBar />
      <PostDetailDrawer />
    </div>
  )
}