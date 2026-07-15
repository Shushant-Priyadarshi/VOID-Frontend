import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        to="/signup"
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Acceptance</h2>
            <p>By accessing Void, you agree to these terms. If you disagree, please do not use the platform.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Medical disclaimer</h2>
            <p>Void is a peer community platform, not a medical advice service. Content shared here does not constitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. Community conduct</h2>
            <p>You agree to: maintain professional respect toward other members; not share patient-identifiable information; not post misinformation about medical treatments; report content that violates these terms.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Anonymous posting</h2>
            <p>Anonymous posts are attributed to your institution and role — not your name. Void takes anonymity seriously and does not publicly reveal the identity behind anonymous posts except where required by law.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">5. Account termination</h2>
            <p>We reserve the right to suspend accounts that violate community guidelines or these terms without prior notice.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">6. Changes to terms</h2>
            <p>We may update these terms periodically. Continued use of Void after changes constitutes acceptance of the updated terms.</p>
          </section>
        </div>

        <div className="border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">
            Questions? Contact us at{" "}
            <a href="mailto:support@void.app" className="underline underline-offset-2 hover:text-foreground">
              support@void.app
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}