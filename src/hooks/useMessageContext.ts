import { useContext } from "react"
import { MessageContext } from "@/context/MessageContext"

export function useMessageContext() {
  const ctx = useContext(MessageContext)
  if (!ctx) throw new Error("useMessageContext must be used within MessageProvider")
  return ctx
}