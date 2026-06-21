import { useParams, Navigate } from "react-router-dom"
import { usePublicProfile } from "@/hooks/usePublicProfile"
import { useFollowCounts } from "@/hooks/useFollowCounts"
import { useSession } from "@/lib/authClient"
import { postApi } from "@/api/post.api"
import PublicProfileHeader from "@/components/page_components/public_profile/PublicProfileHeader"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"
import PostCard from "@/components/page_components/home_page/PostCard"
import FollowButton from "@/components/page_components/follow/FollowButton"
import FollowStats from "@/components/page_components/follow/FollowStats"

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()

  if (!id) {
    return <p className="text-sm text-destructive">Invalid profile URL</p>
  }

  if (session?.user.id === id) {
    return <Navigate to="/profile" replace />
  }

  return <PublicProfileContent userId={id} />
}

function PublicProfileContent({ userId }: { userId: string }) {
  const { profile, posts, setPosts, loading, error } = usePublicProfile(userId)
  const { counts, setCounts } = useFollowCounts(userId)

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

  function handleFollowChange(isFollowing: boolean) {
    setCounts((prev) =>
      prev ? { ...prev, followers: isFollowing ? prev.followers + 1 : prev.followers - 1, isFollowing } : prev
    )
  }

  if (loading) return <ProfileSkeleton />

  if (error || !profile) {
    return <p className="text-center text-sm text-destructive">{error || "User not found"}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 border-b pb-6 pt-2">
        <PublicProfileHeader profile={profile} />

        {counts && (
          <>
            <FollowStats userId={userId} followers={counts.followers} following={counts.following} />
            <FollowButton
              userId={userId}
              initialIsFollowing={counts.isFollowing}
              onChange={handleFollowChange}
            />
          </>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Posts</h2>

        {posts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No posts yet.</p>
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