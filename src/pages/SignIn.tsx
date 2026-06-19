import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { signIn } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import AuthCard from "@/components/page_components/auth/AuthCard"
import GoogleButton from "@/components/page_components/auth/GoogleButton"

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const { error } = await signIn.email({
      email: form.get("email") as string,
      password: form.get("password") as string,
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Login failed")
    } else {
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to your account to continue"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <GoogleButton />
    </AuthCard>
  )
}