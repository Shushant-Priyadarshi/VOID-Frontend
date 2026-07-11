import { useState } from "react"
import { Link } from "react-router-dom"
import { requestPasswordReset } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthCard from "@/components/page_components/auth/AuthCard"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string

    const { error } = await requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <AuthCard title="" description="">
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
            <Mail className="h-7 w-7 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Check your inbox</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If an account exists with that email address, we've sent a password reset link. Check your spam folder if you don't see it.
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full gap-2 border-border/60"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="No worries. Enter your email and we'll send you a reset link."
      footer={
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@hospital.com"
            autoComplete="email"
            required
            className="h-10"
          />
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-10 w-full bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Sending…
            </span>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </AuthCard>
  )
}