import { useParams, Navigate } from "react-router-dom"
import { usePublicProfile } from "@/hooks/usePublicProfile"
import { useSession } from "@/lib/authClient"
import { postApi } from "@/api/post.api"
import PublicProfileHeader from "@/components/page_components/public_profile/PublicProfileHeader"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"
import PostCard from "@/components/page_components/home_page/PostCard"

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()

  if (!id) {
    return <p className="text-sm text-destructive">Invalid profile URL</p>
  }

  // redirect to own profile page if viewing self
  if (session?.user.id === id) {
    return <Navigate to="/profile" replace />
  }

  return <PublicProfileContent userId={id} />
}

function PublicProfileContent({ userId }: { userId: string }) {
  const { profile, posts, setPosts, loading, error } = usePublicProfile(userId)

  function handleLikeToggle(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    )
    postApi.toggleLike(postId).catch(() => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1 }
            : p
        )
      )
    })
  }

  if (loading) return <ProfileSkeleton />

  if (error || !profile) {
    return <p className="text-center text-sm text-destructive">{error || "User not found"}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <PublicProfileHeader profile={profile} />

      <div>
        <h2 className="mb-3 text-sm font-semibold">Posts</h2>

        {posts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No posts yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}