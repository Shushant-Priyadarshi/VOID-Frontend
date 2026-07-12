import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "@/lib/authClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthCard from "@/components/page_components/auth/AuthCard"
import GoogleButton from "@/components/page_components/auth/GoogleButton"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

const fieldVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, delay: i * 0.05, ease: "easeOut" },
  }),
}

export default function SignUp() {
  const navigate = useNavigate()
  const shouldReduce = useReducedMotion()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const password = form.get("password") as string
    const confirmPassword = form.get("confirmPassword") as string

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const { error } = await signUp.email({
      name: form.get("name") as string,
      email: form.get("email") as string,
      password,
      callbackURL: `${import.meta.env.VITE_BASE_URL}/email-verified`,
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Signup failed")
    } else {
      navigate("/email-verification-sent")
    }
  }

  return (
    <AuthCard
      title="Join Void"
      description="Create your account and connect with the medical community"
      footer={
        <div className="space-y-3 text-center">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/70">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      }
    >
      {/* Google */}
      <motion.div
        custom={0}
        variants={shouldReduce ? undefined : fieldVariants}
        initial="initial"
        animate="animate"
      >
        <GoogleButton />
      </motion.div>

      {/* Divider */}
      <motion.div
        custom={1}
        variants={shouldReduce ? undefined : fieldVariants}
        initial="initial"
        animate="animate"
        className="flex items-center gap-3"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or sign up with email</span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div custom={2} variants={shouldReduce ? undefined : fieldVariants} initial="initial" animate="animate" className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
          <Input
            id="name" name="name"
            placeholder="Dr. Aarav Mehta"
            autoComplete="name"
            required
            className="h-10 focus-visible:ring-teal-500/30"
          />
        </motion.div>

        <motion.div custom={3} variants={shouldReduce ? undefined : fieldVariants} initial="initial" animate="animate" className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
          <Input
            id="email" name="email"
            type="email"
            placeholder="you@hospital.com"
            autoComplete="email"
            required
            className="h-10 focus-visible:ring-teal-500/30"
          />
        </motion.div>

        <motion.div custom={4} variants={shouldReduce ? undefined : fieldVariants} initial="initial" animate="animate" className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password" name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="h-10 pr-10 focus-visible:ring-teal-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
        </motion.div>

        <motion.div custom={5} variants={shouldReduce ? undefined : fieldVariants} initial="initial" animate="animate" className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword" name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="h-10 pr-10 focus-visible:ring-teal-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2"
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        <motion.div custom={6} variants={shouldReduce ? undefined : fieldVariants} initial="initial" animate="animate">
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
                Creating account…
              </span>
            ) : "Create account"}
          </Button>
        </motion.div>
      </form>
    </AuthCard>
  )
}