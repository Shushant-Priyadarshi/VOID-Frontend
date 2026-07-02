import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";
import { postApi } from "@/api/post.api";
import { userApi } from "@/api/user.api";
import PostCard from "@/components/page_components/home_page/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, SearchUser } from "@/types";
import SearchUserCard from "@/components/page_components/search/SearchUserCard";
import { useSearchParams } from "react-router-dom";


interface State {
  latest: Post[];
  top: Post[];
  users: SearchUser[];
  loading: boolean;
  searched: boolean;
  error: string;
}

const initial: State = {
  latest: [],
  top: [],
  users: [],
  loading: false,
  searched: false,
  error: "",
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [state, setState] = useState<State>(() => {
    if (initialQuery) return { ...initial, searched: true, loading: true };
    return initial;
  });

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
  }, []);

  const runSearch = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) {
      setState(initial);
      return;
    }

    setState((s) => ({ ...s, loading: true, searched: true, error: "" }));

    try {
      const [latestRes, topRes, usersRes] = await Promise.all([
        postApi.searchPosts(value, "latest"),
        postApi.searchPosts(value, "top"),
        userApi.searchUsers(value),
      ]);

      setState((s) => ({
        ...s,
        latest: latestRes.data,
        top: topRes.data,
        users: usersRes.data,
        loading: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Search failed",
      }));
    }
  }, 400);

  function handleChange(value: string) {
    setQuery(value);
    runSearch(value);
  }

  function handleLikeToggleLatest(postId: string) {
    setState((s) => ({
      ...s,
      latest: toggleLike(s.latest, postId),
    }));
    postApi.toggleLike(postId);
  }

  function handleLikeToggleTop(postId: string) {
    setState((s) => ({
      ...s,
      top: toggleLike(s.top, postId),
    }));
    postApi.toggleLike(postId);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Search</h1>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search posts, users..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {!state.searched && (
        <p className="pt-8 text-center text-sm text-muted-foreground">
          Start typing to search posts and users
        </p>
      )}

      {state.searched && (
        <Tabs defaultValue="latest">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="top">Top</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="latest">
            <ResultList
              loading={state.loading}
              empty={state.latest.length === 0}
              emptyText="No posts found"
            >
              {state.latest.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLikeToggle={handleLikeToggleLatest}
                />
              ))}
            </ResultList>
          </TabsContent>

          <TabsContent value="top">
            <ResultList
              loading={state.loading}
              empty={state.top.length === 0}
              emptyText="No posts found"
            >
              {state.top.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLikeToggle={handleLikeToggleTop}
                />
              ))}
            </ResultList>
          </TabsContent>

          <TabsContent value="users">
            <ResultList
              loading={state.loading}
              empty={state.users.length === 0}
              emptyText="No users found"
            >
              {state.users.map((user) => (
                <SearchUserCard key={user.id} user={user} />
              ))}
            </ResultList>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ResultList({
  loading,
  empty,
  emptyText,
  children,
}: {
  loading: boolean;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  if (empty) {
    return (
      <p className="pt-8 text-center text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }
  return <div className="flex flex-col gap-3 pt-4">{children}</div>;
}

function toggleLike(posts: Post[], postId: string): Post[] {
  return posts.map((p) =>
    p.id === postId
      ? {
          ...p,
          likedByMe: !p.likedByMe,
          likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
        }
      : p,
  );
}
