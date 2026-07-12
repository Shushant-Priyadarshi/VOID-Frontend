import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        to="/"
        className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Void
      </Link>

      <div className="space-y-8">
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
                <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
              </svg>
            </div>
            <span className="font-bold tracking-tight">Void</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">What we collect</h2>
            <p>We collect information you provide (name, email, institution) and usage data (posts, interactions). We do not sell your personal data.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Anonymous posts</h2>
            <p>When you post anonymously, your name is not shown. Your institution and role are displayed as the attribution. Internally, the post is associated with your account for moderation purposes only.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">How we use your data</h2>
            <p>Your information is used to: operate your account, display your profile, send notifications you've enabled, and improve the platform experience.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Data storage</h2>
            <p>Your data is stored securely. Profile images are stored in Cloudflare R2. We use industry-standard encryption in transit and at rest.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Your rights</h2>
            <p>You may request deletion of your account and associated data at any time by contacting us. Some data may be retained for legal compliance purposes.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Cookies</h2>
            <p>We use session cookies for authentication. We do not use third-party advertising cookies.</p>
          </section>
        </div>

        <div className="border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Privacy questions?{" "}
            <a href="mailto:privacy@void.app" className="underline underline-offset-2 hover:text-foreground">
              privacy@void.app
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}