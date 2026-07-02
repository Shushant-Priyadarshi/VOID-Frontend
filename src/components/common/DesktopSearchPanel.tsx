import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, FileText, Users, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { postApi } from "@/api/post.api"
import { userApi } from "@/api/user.api"
import { usePostDrawer } from "@/hooks/usePostDrawer"
import { cn } from "@/lib/utils"
import type { Post, SearchUser } from "@/types"

type Tab = "posts" | "users"

export default function DesktopSearchPanel() {
  const navigate = useNavigate()
  const { openPost } = usePostDrawer()

  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("posts")

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
      setPosts(postsRes.data)
      setUsers(usersRes.data)
    } catch {
      setPosts([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, 300)

  function handleChange(value: string) {
    setQuery(value)
    if (value.trim()) setLoading(true)
    runSearch(value)
  }

  function clearSearch() {
    setQuery("")
    setPosts([])
    setUsers([])
    setSearched(false)
    setLoading(false)
  }

  const hasResults = posts.length > 0 || users.length > 0

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:right-0 md:flex md:w-72 md:flex-col md:border-l md:bg-background">
      {/* Header — matches sidebar top height */}
      <div className="flex h-16 items-center border-b px-4">
        <p className="text-sm font-semibold text-foreground">Search</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts, people..."
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className="h-9 pl-8 pr-8 text-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Idle state */}
        {!searched && !loading && (
          <div className="flex flex-col items-center gap-2 pt-8 text-center">
            <Search className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Search for posts or people
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-md p-2">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <Skeleton className="h-2.5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            {!hasResults ? (
              <p className="pt-6 text-center text-xs text-muted-foreground">
                No results for &quot;{query}&quot;
              </p>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-1 rounded-md bg-muted p-0.5">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded py-1 text-xs font-medium transition-colors",
                      activeTab === "posts"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className="h-3 w-3" />
                    Posts
                    {posts.length > 0 && (
                      <span className="rounded-full bg-muted px-1 text-[10px]">
                        {posts.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded py-1 text-xs font-medium transition-colors",
                      activeTab === "users"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Users className="h-3 w-3" />
                    People
                    {users.length > 0 && (
                      <span className="rounded-full bg-muted px-1 text-[10px]">
                        {users.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Results list — scrollable */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === "posts" && (
                    <div className="flex flex-col gap-0.5">
                      {posts.length === 0 ? (
                        <p className="pt-4 text-center text-xs text-muted-foreground">
                          No posts found
                        </p>
                      ) : (
                        posts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => openPost(post.id)}
                            className="w-full rounded-md p-2.5 text-left transition-colors hover:bg-accent"
                          >
                            <p className="truncate text-xs font-semibold leading-tight">
                              {post.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                              {post.content}
                            </p>
                            <p className="mt-1 text-[10px] text-muted-foreground/60">
                              {post.isAnonymous
                                ? post.anonymousLabel
                                : post.author?.name}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "users" && (
                    <div className="flex flex-col gap-0.5">
                      {users.length === 0 ? (
                        <p className="pt-4 text-center text-xs text-muted-foreground">
                          No people found
                        </p>
                      ) : (
                        users.map((user) => (
                          <Link
                            key={user.id}
                            to={`/u/${user.id}`}
                            className="flex items-center gap-2.5 rounded-md p-2.5 transition-colors hover:bg-accent"
                          >
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={user.profileImage ?? undefined} />
                              <AvatarFallback className="text-xs">
                                {user.name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">
                                {user.name}
                              </p>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {user.college || user.hospital || user.role}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="shrink-0 text-[10px]"
                            >
                              {user.role === "MENTOR" ? "Mentor" : user.role === "ADMIN" ? "Admin" : "User"}
                            </Badge>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* See all results link */}
                <button
                  onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                  className="shrink-0 rounded-md border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  See all results for &quot;{query}&quot;
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}