import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { resetPassword } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthCard from "@/components/page_components/auth/AuthCard"

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!token) {
      setError("Missing or invalid reset token")
      return
    }

    const form = new FormData(e.currentTarget)
    const newPassword = form.get("password") as string

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    setError("")

    const { error } = await resetPassword({
      newPassword,
      token,
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
    } else {
      navigate("/login")
    }
  }

  if (!token) {
    return (
      <AuthCard title="Invalid link" description="">
        <p className="text-sm text-muted-foreground">
          This password reset link is invalid or has expired.
        </p>
        <Link to="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Request a new link
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Reset password" description="Enter your new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  )
}