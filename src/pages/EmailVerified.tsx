import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import AuthCard from "@/components/page_components/auth/AuthCard"
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react"
import { authClient } from "@/lib/authClient"

type Status = "verifying" | "success" | "error"

export default function EmailVerified() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error")

  useEffect(() => {
    if (!token) return

    let cancelled = false

    authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      if (cancelled) return
      setStatus(error ? "error" : "success")
    })

    return () => { cancelled = true }
  }, [token])

  if (status === "verifying") {
    return (
      <AuthCard title="" description="">
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Verifying your email</h2>
            <p className="text-sm text-muted-foreground">
              Just a moment…
            </p>
          </div>
        </div>
      </AuthCard>
    )
  }

  if (status === "error") {
    return (
      <AuthCard title="" description="">
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Verification failed</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This link is invalid or has expired. Verification links are only valid for 24 hours.
            </p>
          </div>
          <div className="w-full space-y-2 pt-1">
            <Link to="/signup">
              <Button className="w-full bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500">
                Create a new account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full border-border/60">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="" description="">
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
          <CheckCircle2 className="h-7 w-7 text-teal-600 dark:text-teal-400" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Email verified</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your account is now active. Welcome to Void — the medical community built for people like you.
          </p>
        </div>
        <Link to="/login" className="w-full pt-1">
          <Button className="w-full gap-2 bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500">
            Continue to sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </AuthCard>
  )
}