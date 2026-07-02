import { createContext, useState, type ReactNode } from "react"

interface PostDrawerContextValue {
  openPostId: string | null
  openPost: (id: string) => void
  closePost: () => void
}

export const PostDrawerContext = createContext<PostDrawerContextValue | null>(null)

export function PostDrawerProvider({ children }: { children: ReactNode }) {
  const [openPostId, setOpenPostId] = useState<string | null>(null)

  return (
    <PostDrawerContext.Provider value={{
      openPostId,
      openPost: (id) => setOpenPostId(id),
      closePost: () => setOpenPostId(null),
    }}>
      {children}
    </PostDrawerContext.Provider>
  )
}
