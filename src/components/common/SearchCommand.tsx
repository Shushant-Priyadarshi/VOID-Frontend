import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Search, Users } from "lucide-react"
import { postApi } from "@/api/post.api"
import { userApi } from "@/api/user.api"
import type { Post, SearchUser } from "@/types"
import { usePostDrawer } from "@/hooks/usePostDrawer"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchCommand({ open, onOpenChange }: Props) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} showCloseButton={true}>
      {/*
        key={open ? "open" : "closed"} — when dialog closes, this inner component
        fully unmounts and remounts when reopened, resetting all state naturally
        without needing any setState calls in effects
      */}
      <SearchInner key={open ? "open" : "closed"} onOpenChange={onOpenChange} />
    </CommandDialog>
  )
}

function SearchInner({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate()
  const { openPost } = usePostDrawer()
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) {
      setPosts([])
      setUsers([])
      setSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const [postsRes, usersRes] = await Promise.all([
        postApi.searchPosts(value, "latest"),
        userApi.searchUsers(value),
      ])
      setPosts(postsRes.data.slice(0, 5))
      setUsers(usersRes.data.slice(0, 5))
    } catch {
      setPosts([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, 300)

  function handleValueChange(value: string) {
    setQuery(value)
    if (value.trim()) setLoading(true)
    runSearch(value)
  }

  const hasResults = posts.length > 0 || users.length > 0
  const showEmpty = searched && !loading && !hasResults

  return (
    <>
      <CommandInput
        placeholder="Search posts, users..."
        value={query}
        onValueChange={handleValueChange}
      />

      <CommandList className="max-h-100]">
        {!query && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Search className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Search for posts and people</p>
            <p className="text-xs text-muted-foreground/60">
              Try searching a topic, name, or keyword
            </p>
          </div>
        )}

        {loading && (
          <div className="space-y-1 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
                <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {showEmpty && (
          <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>
        )}

        {!loading && users.length > 0 && (
          <CommandGroup heading="People">
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={`user-${user.id}`}
                onSelect={() => {
                  navigate(`/u/${user.id}`)
                  onOpenChange(false)
                }}
              >
                <Avatar className="mr-2 h-6 w-6 shrink-0">
                  <AvatarImage src={user.profileImage ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {user.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.college || user.hospital || user.role}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!loading && users.length > 0 && posts.length > 0 && <CommandSeparator />}

        {!loading && posts.length > 0 && (
          <CommandGroup heading="Posts">
            {posts.map((post) => (
              <CommandItem
                key={post.id}
                value={`post-${post.id}`}
                onSelect={() => {
                  openPost(post.id)
                  onOpenChange(false)
                }}
              >
                <FileText className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {post.isAnonymous ? post.anonymousLabel : post.author?.name}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!loading && query && hasResults && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="see-all"
                onSelect={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`)
                  onOpenChange(false)
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                See all results for &quot;{query}&quot;
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </>
  )
}