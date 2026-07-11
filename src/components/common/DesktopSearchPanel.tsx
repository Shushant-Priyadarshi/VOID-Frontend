import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
      setPosts([]); setUsers([]); setSearched(false); setLoading(false)
      return
    }
    setLoading(true); setSearched(true)
    try {
      const [postsRes, usersRes] = await Promise.all([
        postApi.searchPosts(value, "latest"),
        userApi.searchUsers(value),
      ])
      setPosts(postsRes.data); setUsers(usersRes.data)
    } catch {
      setPosts([]); setUsers([])
    } finally {
      setLoading(false)
    }
  }, 300)

  function handleChange(value: string) {
    setQuery(value)
    if (value.trim()) setLoading(true)
    runSearch(value)
  }

  const hasResults = posts.length > 0 || users.length > 0

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:right-0 md:flex md:w-72 md:flex-col md:border-l md:bg-background">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <p className="text-sm font-semibold text-foreground">Search</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4">
        {/* Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Posts, people, topics…"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className="h-9 pl-8 pr-7 text-sm focus-visible:ring-teal-500/30"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setPosts([]); setUsers([]); setSearched(false); setLoading(false) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Idle */}
        {!searched && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Search className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">Search for posts or people</p>
          </div>
        )}

        {/* Loading */}
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
              <div className="pt-6 text-center">
                <p className="text-xs text-muted-foreground">No results for "{query}"</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex rounded-lg border border-border/60 p-0.5">
                  {(["posts", "users"] as const).map((tab) => {
                    const count = tab === "posts" ? posts.length : users.length
                    const Icon = tab === "posts" ? FileText : Users
                    const label = tab === "posts" ? "Posts" : "People"
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors",
                          activeTab === tab
                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                        {count > 0 && (
                          <span className={cn(
                            "rounded-full px-1 text-[10px] tabular-nums",
                            activeTab === tab ? "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-400" : "bg-muted"
                          )}>
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Results list */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === "posts" && (
                    <div className="flex flex-col gap-0.5">
                      {posts.length === 0 ? (
                        <p className="pt-4 text-center text-xs text-muted-foreground">No posts found</p>
                      ) : posts.map((post) => (
                        <button
                          key={post.id}
                          onClick={() => openPost(post.id)}
                          className="group w-full rounded-lg p-2.5 text-left transition-colors hover:bg-muted/50"
                        >
                          <p className="truncate text-xs font-semibold text-foreground leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {post.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                            {post.content}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/50">
                            {post.isAnonymous ? post.anonymousLabel : post.author?.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === "users" && (
                    <div className="flex flex-col gap-0.5">
                      {users.length === 0 ? (
                        <p className="pt-4 text-center text-xs text-muted-foreground">No people found</p>
                      ) : users.map((user) => (
                        <Link
                          key={user.id}
                          to={`/u/${user.id}`}
                          className="flex items-center gap-2.5 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.profileImage ?? undefined} />
                            <AvatarFallback className="text-xs font-medium">
                              {user.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {user.college || user.hospital || user.role}
                            </p>
                          </div>
                          {user.role === "MENTOR" && (
                            <span className="shrink-0 rounded-full border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-400">
                              Mentor
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                  className="shrink-0 rounded-lg border border-border/60 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-teal-400/40 hover:bg-teal-50/30 hover:text-teal-600 dark:hover:bg-teal-950/20 dark:hover:text-teal-400"
                >
                  See all results for "{query}"
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}