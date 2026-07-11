import { type ReactNode } from "react"
import { Link } from "react-router-dom"

interface Props {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const quotes = [
  {
    text: "Medicine is a science of uncertainty and an art of probability.",
    author: "William Osler"
  },
  {
    text: "The good physician treats the disease; the great physician treats the patient who has the disease.",
    author: "William Osler"
  },
  {
    text: "Wherever the art of medicine is loved, there is also a love of humanity.",
    author: "Hippocrates"
  }
]

const quote = quotes[0]

export default function AuthCard({ title, description, children, footer }: Props) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel — brand + quote. Hidden on mobile */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-slate-900 p-10 dark:bg-slate-950 lg:flex">
        {/* Subtle background cross pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Crect x='27' y='10' width='6' height='40' rx='1'/%3E%3Crect x='10' y='27' width='40' height='6' rx='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top — logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
              <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Void</span>
        </Link>

        {/* Center — headline */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-teal-400">
              For doctors &amp; medical aspirants
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
              A community that understands what you carry.
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Share anonymously, learn from peers, find mentors, and build connections that matter — within a network that speaks your language.
          </p>
        </div>

        {/* Bottom — quote */}
        <figure className="space-y-2 border-l-2 border-teal-500/40 pl-4">
          <blockquote className="text-sm italic leading-relaxed text-slate-300">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <figcaption className="text-xs text-slate-500">— {quote.author}</figcaption>
        </figure>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col lg:w-[55%]">
        {/* Mobile-only top bar */}
        <div className="flex items-center gap-2 border-b px-6 py-4 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
              <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">Void</span>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Form content */}
            <div className="space-y-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="pt-1">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}