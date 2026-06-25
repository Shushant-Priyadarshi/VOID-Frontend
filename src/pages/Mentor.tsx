import { useEffect, useState } from "react"
import { mentorApi } from "@/api/mentor.api"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CategoryFilter from "@/components/page_components/mentor_page/CategoryFilter"
import MentorCard from "@/components/page_components/mentor_page/MentorCard"
import type { MentorProfile, MentorCategory } from "@/types"

export default function Mentor() {
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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Find a Mentor</h1>
        <p className="text-sm text-muted-foreground">
          Connect with experienced doctors and senior students
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, specialization, organization..."
          className="pl-9"
          onChange={(e) => debouncedSetSearch(e.target.value)}
        />
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} />

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && mentors.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No mentors found.</p>
      )}

      {!loading && (
        <div className="flex flex-col gap-3">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}
    </div>
  )
}