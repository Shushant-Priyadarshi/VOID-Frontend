import { useState } from "react"
import { Link } from "react-router-dom"
import { requestPasswordReset} from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthCard from "@/components/page_components/auth/AuthCard"

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
      <AuthCard title="Check your email" description="">
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, we&apos;ve sent a password reset link.
        </p>
        <Link to="/login" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Back to login
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password" description="Enter your email to receive a reset link">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        <Link to="/login" className="text-center text-sm text-muted-foreground hover:text-primary">
          Back to login
        </Link>
      </form>
    </AuthCard>
  )
}