import { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"

interface Props {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const quotes = [
  {
    text: "Medicine is a science of uncertainty and an art of probability.",
    author: "William Osler",
  },
]

const quote = quotes[0]

export default function AuthCard({ title, description, children, footer }: Props) {
  const shouldReduce = useReducedMotion()

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
        animate={shouldReduce ? {} : { opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-slate-900 p-10 dark:bg-slate-950 lg:flex"
      >
        {/* Subtle background cross pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Crect x='27' y='10' width='6' height='40' rx='1'/%3E%3Crect x='10' y='27' width='40' height='6' rx='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
          animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
                <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">Void</span>
          </Link>
        </motion.div>

        {/* Center headline */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="space-y-6"
        >
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
        </motion.div>

        {/* Quote */}
        <motion.figure
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={shouldReduce ? {} : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-2 border-l-2 border-teal-500/40 pl-4"
        >
          <blockquote className="text-sm italic leading-relaxed text-slate-300">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <figcaption className="text-xs text-slate-500">— {quote.author}</figcaption>
        </motion.figure>
      </motion.div>

      {/* Right panel */}
      <div className="flex w-full flex-col lg:w-[55%]">
        {/* Mobile-only top bar */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -8 }}
          animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-2 border-b px-6 py-4 lg:hidden"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-600">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="7" y="2" width="2" height="12" rx="0.5" fill="white" />
              <rect x="2" y="7" width="12" height="2" rx="0.5" fill="white" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">Void</span>
        </motion.div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-sm space-y-6"
          >
            {/* Header */}
            {(title || description) && (
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
                animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                className="space-y-1"
              >
                {title && <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </motion.div>
            )}

            {/* Form content — staggered */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
              animate={shouldReduce ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.28, ease: "easeOut" }}
              className="space-y-5"
            >
              {children}
            </motion.div>

            {/* Footer */}
            {footer && (
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0 }}
                animate={shouldReduce ? {} : { opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.38 }}
                className="pt-1"
              >
                {footer}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}