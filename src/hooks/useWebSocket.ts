import { useEffect, useRef, useCallback } from "react"
import { useSession } from "@/lib/authClient"
import type { WSMessage } from "@/types"

const WS_URL = import.meta.env.VITE_API_URL.replace("http", "ws") + "/ws"

type MessageHandler = (message: WSMessage) => void

export function useWebSocket(onMessage: MessageHandler) {
  const { data: session } = useSession()
  const wsRef = useRef<WebSocket | null>(null)

  // Fix 1: provide initial value of 0 (browser setTimeout returns number)
  const reconnectTimeout = useRef<number>(0)

  // Fix 2: sync the handler in an effect instead of during render
  const onMessageRef = useRef<MessageHandler>(onMessage)
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  // Fix 3: store connect in a ref so it can self-reference recursively
  // without the "accessed before declared" problem
  const connectRef = useRef<() => void>(() => {})

  const connect = useCallback(() => {
    if (!session) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WSMessage
        onMessageRef.current(message)
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = (event) => {
      wsRef.current = null

      // Use the ref to call connect recursively — no declaration-order issue
      if (event.code !== 1008) {
        reconnectTimeout.current = window.setTimeout(() => {
          connectRef.current()
        }, 3000)
      }
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [session])

  // Keep the ref in sync with the latest connect function
  useEffect(() => {
    connectRef.current = connect
  }, [connect])

  useEffect(() => {
    connect()

    return () => {
      window.clearTimeout(reconnectTimeout.current)
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect])

  const send = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  return { send }
}