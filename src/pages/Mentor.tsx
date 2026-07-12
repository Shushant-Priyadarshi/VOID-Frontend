import { useEffect, useState } from "react"
import { mentorApi } from "@/api/mentor.api"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Search, Stethoscope } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CategoryFilter from "@/components/page_components/mentor_page/CategoryFilter"
import MentorCard from "@/components/page_components/mentor_page/MentorCard"
import type { MentorProfile, MentorCategory } from "@/types"
import { motion, useReducedMotion } from "framer-motion"
import { pageVariants, listVariants, itemVariants } from "@/lib/animations"

function MentorCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2 pt-0.5">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
          <div className="flex gap-2 pt-0.5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-10 rounded" />
      </div>
    </div>
  )
}

export default function Mentor() {
  const shouldReduce = useReducedMotion()
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [category, setCategory] = useState<MentorCategory | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await mentorApi.listMentors(category ?? undefined, search || undefined)
        if (cancelled) return
        setMentors(res.data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load mentors")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [category, search])

  const debouncedSetSearch = useDebouncedCallback((value: string) => setSearch(value), 400)

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Find a Mentor</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Connect with experienced doctors and senior students in the community
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Name, specialization, or organization…"
          className="h-11 pl-9 text-sm focus-visible:ring-teal-500/30"
          onChange={(e) => debouncedSetSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <MentorCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && mentors.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Stethoscope className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">No mentors found</p>
            <p className="text-xs text-muted-foreground">
              Try a different category or search term
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && mentors.length > 0 && (
        <motion.div
          variants={shouldReduce ? {} : listVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-3"
        >
          {mentors.map((mentor) => (
            <motion.div key={mentor.id} variants={shouldReduce ? {} : itemVariants}>
              <MentorCard mentor={mentor} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}