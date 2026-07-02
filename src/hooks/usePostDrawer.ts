import { useContext } from "react"
import { PostDrawerContext } from "../context/PostDrawerContext"

export function usePostDrawer() {
  const ctx = useContext(PostDrawerContext)
  if (!ctx) throw new Error("usePostDrawer must be used within PostDrawerProvider")
  return ctx
}