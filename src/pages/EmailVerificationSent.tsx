import { Link } from "react-router-dom"
import AuthCard from "@/components/page_components/auth/AuthCard"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"

export default function EmailVerificationSent() {
  return (
    <AuthCard title="" description="">
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        {/* Icon with a subtle pulsing ring to convey "waiting / in progress" */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/20 dark:bg-teal-400/10" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
            <Mail className="h-7 w-7 text-teal-600 dark:text-teal-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Verify your email</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We've sent a verification link to your email address. Click the link to activate your account.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Didn't receive it? Check your spam folder.
          </p>
        </div>

        <div className="w-full space-y-2 pt-1">
          <div className="rounded-md border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            The link expires in <span className="font-medium text-foreground">24 hours</span>. You can close this tab.
          </div>

          <Link to="/login">
            <Button
              variant="outline"
              className="mt-2 w-full gap-2 border-border/60"
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