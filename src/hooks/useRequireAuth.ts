import { useState } from "react"
import { useSession } from "@/lib/authClient"

export function useRequireAuth() {
  const { data: session } = useSession()
  const [promptOpen, setPromptOpen] = useState(false)

  function withAuth(action: () => void) {
    if (!session) {
      setPromptOpen(true)
      return
    }
    action()
  }

  return { isAuthed: !!session, promptOpen, setPromptOpen, withAuth }
}