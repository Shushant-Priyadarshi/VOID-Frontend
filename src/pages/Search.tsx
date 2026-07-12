import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search as SearchIcon, TrendingUp, Clock } from "lucide-react"
import { postApi } from "@/api/post.api"
import { userApi } from "@/api/user.api"
import PostCard from "@/components/page_components/home_page/PostCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { Post, SearchUser } from "@/types"
import SearchUserCard from "@/components/page_components/search/SearchUserCard"
import { useSearchParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { pageVariants, listVariants, itemVariants } from "@/lib/animations"

interface State {
  latest: Post[]
  top: Post[]
  users: SearchUser[]
  loading: boolean
  searched: boolean
  error: string
}

const initial: State = { latest: [], top: [], users: [], loading: false, searched: false, error: "" }

function PostSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-2.5">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-2/3 rounded" />
      </div>
    </div>
  )
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-32 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  )
}

function ResultList({ loading, empty, emptyText, isUsers, children }: {
  loading: boolean
  empty: boolean
  emptyText: string
  isUsers?: boolean
  children: React.ReactNode
}) {
  const shouldReduce = useReducedMotion()

  if (loading) {
    return (
      <div className="flex flex-col gap-3 pt-4">
        {isUsers
          ? [1, 2, 3].map((i) => <UserSkeleton key={i} />)
          : [1, 2, 3].map((i) => <PostSkeleton key={i} />)}
      </div>
    )
  }
  if (empty) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </div>
    )
  }
  return (
    <motion.div
      variants={shouldReduce ? {} : listVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-3 pt-4"
    >
      {children}
    </motion.div>
  )
}

export default function Search() {
  const shouldReduce = useReducedMotion()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(initialQuery)
  const [state, setState] = useState<State>(() =>
    initialQuery ? { ...initial, searched: true, loading: true } : initial
  )

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery)
  }, [])

  const runSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) { setState(initial); return }
    setState((s) => ({ ...s, loading: true, searched: true, error: "" }))
    try {
      const [latestRes, topRes, usersRes] = await Promise.all([
        postApi.searchPosts(value, "latest"),
        postApi.searchPosts(value, "top"),
        userApi.searchUsers(value),
      ])
      setState((s) => ({ ...s, latest: latestRes.data, top: topRes.data, users: usersRes.data, loading: false }))
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : "Search failed" }))
    }
  }, 400)

  function handleChange(value: string) {
    setQuery(value)
    runSearch(value)
  }

  function toggleLike(posts: Post[], postId: string): Post[] {
    return posts.map((p) =>
      p.id === postId ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 } : p
    )
  }

  const totalResults = state.latest.length + state.users.length

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Search</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Find posts, doctors, and students
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search posts, people, topics…"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="h-11 pl-9 text-sm focus-visible:ring-teal-500/30"
        />
      </div>

      {/* Idle state */}
      {!state.searched && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <SearchIcon className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Search Void</p>
            <p className="text-xs text-muted-foreground">Try a topic, name, specialization, or condition</p>
          </div>
        </div>
      )}

      {/* Results */}
      {state.searched && (
        <>
          {/* Result count */}
          {!state.loading && totalResults > 0 && (
            <p className="text-xs text-muted-foreground">
              Found <span className="font-medium text-foreground">{totalResults}</span> results for "{query}"
            </p>
          )}

          {state.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="text-sm text-destructive">{state.error}</p>
            </div>
          )}

          <Tabs defaultValue="latest">
            <TabsList className="grid w-full grid-cols-3 h-10">
              <TabsTrigger value="latest" className="gap-1.5 text-xs data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400">
                <Clock className="h-3.5 w-3.5" />
                Latest
                {state.latest.length > 0 && !state.loading && (
                  <span className="rounded-full bg-muted px-1 text-[10px] tabular-nums">{state.latest.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="top" className="gap-1.5 text-xs data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400">
                <TrendingUp className="h-3.5 w-3.5" />
                Top
                {state.top.length > 0 && !state.loading && (
                  <span className="rounded-full bg-muted px-1 text-[10px] tabular-nums">{state.top.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1.5 text-xs data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-400">
                People
                {state.users.length > 0 && !state.loading && (
                  <span className="rounded-full bg-muted px-1 text-[10px] tabular-nums">{state.users.length}</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest">
              <ResultList loading={state.loading} empty={state.latest.length === 0} emptyText="No posts found for this search.">
                {state.latest.map((post) => (
                  <motion.div key={post.id} variants={shouldReduce ? {} : itemVariants}>
                    <PostCard post={post} onLikeToggle={(id) => setState((s) => ({ ...s, latest: toggleLike(s.latest, id) }))} />
                  </motion.div>
                ))}
              </ResultList>
            </TabsContent>

            <TabsContent value="top">
              <ResultList loading={state.loading} empty={state.top.length === 0} emptyText="No posts found for this search.">
                {state.top.map((post) => (
                  <motion.div key={post.id} variants={shouldReduce ? {} : itemVariants}>
                    <PostCard post={post} onLikeToggle={(id) => setState((s) => ({ ...s, top: toggleLike(s.top, id) }))} />
                  </motion.div>
                ))}
              </ResultList>
            </TabsContent>

            <TabsContent value="users">
              <ResultList loading={state.loading} empty={state.users.length === 0} emptyText="No people found for this search." isUsers>
                {state.users.map((user) => (
                  <motion.div key={user.id} variants={shouldReduce ? {} : itemVariants}>
                    <SearchUserCard user={user} />
                  </motion.div>
                ))}
              </ResultList>
            </TabsContent>
          </Tabs>
        </>
      )}
    </motion.div>
  )
}