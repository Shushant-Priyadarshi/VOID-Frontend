import { ProfileContext } from "@/context/ProfileContext"
import { useContext } from "react"


export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider")
  return ctx
}