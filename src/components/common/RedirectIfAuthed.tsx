import { useSession } from "@/lib/authClient"
import { Navigate, Outlet } from "react-router-dom"

export default function RedirectIfAuthed() {
  const { data: session, isPending } = useSession()

  if (isPending) return null
  if (session) return <Navigate to="/" replace />

  return <Outlet />
}