import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import AuthCard from "@/components/page_components/auth/AuthCard"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { authClient } from "@/lib/authClient"

type Status = "verifying" | "success" | "error"

export default function EmailVerified() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  // if there's no token at all, we already know it's an error — no need for state
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error")

  useEffect(() => {
    if (!token) return  // nothing to do, already "error" from initial state

    let cancelled = false

    authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      if (cancelled) return
      setStatus(error ? "error" : "success")
    })

    return () => {
      cancelled = true
    }
  }, [token])

  if (status === "verifying") {
    return (
      <AuthCard title="Verifying email" description="">
        <div className="flex flex-col items-center gap-3 py-2">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">
            Please wait while we verify your email...
          </p>
        </div>
      </AuthCard>
    )
  }

  if (status === "error") {
    return (
      <AuthCard title="Verification failed" description="">
        <div className="flex flex-col items-center gap-3 py-2">
          <XCircle className="h-12 w-12 text-destructive" />
          <p className="text-center text-sm text-muted-foreground">
            This verification link is invalid or has expired.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/login">Back to login</Link>
        </Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Email verified" description="">
      <div className="flex flex-col items-center gap-3 py-2">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="text-center text-sm text-muted-foreground">
          Your email has been verified. You can login now!
        </p>
      </div>
      <Button asChild className="w-full">
        <Link to="/login">Go to login</Link>
      </Button>
    </AuthCard>
  )
}