import AuthCard from "@/components/page_components/auth/AuthCard"
import { CheckCircle2 } from "lucide-react"

export default function EmailVerificationSent() {
  return (
    <AuthCard title="Link Sent" description="">
      <div className="flex flex-col items-center gap-3 py-2">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="text-center text-sm text-muted-foreground">
          We have sent a link on your email account.
        </p>
      </div>
    </AuthCard>
  )
}