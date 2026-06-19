import { useState } from "react"
import PostCard from "./PostCard"
import { mockPosts } from "@/lib/mockData"
import type { Post } from "@/types"

export default function FeedList() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)

  function handleLikeToggle(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
      ))}
    </div>
  )
}