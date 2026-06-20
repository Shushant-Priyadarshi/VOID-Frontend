import { useState} from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"
import { postApi } from "@/api/post.api"
import PostCard from "@/components/page_components/home_page/PostCard"
import type { Post } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const res = await postApi.searchPosts(value)
      setResults(res.data)
    } finally {
      setLoading(false)
    }
  }, 400)

  function handleChange(value: string) {
    setQuery(value)
    runSearch(value)
  }

  function handleLikeToggle(postId: string) {
    setResults((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No posts found</p>
      )}

      {!loading && results.map((post) => (
        <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
      ))}
    </div>
  )
}