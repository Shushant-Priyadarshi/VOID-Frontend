import { useParams, Navigate } from "react-router-dom"
import { usePublicProfile } from "@/hooks/usePublicProfile"
import { useFollowCounts } from "@/hooks/useFollowCounts"
import { useSession } from "@/lib/authClient"
import { postApi } from "@/api/post.api"
import ProfileSkeleton from "@/components/page_components/profile_page/ProfileSkeleton"
import PostCard from "@/components/page_components/home_page/PostCard"
import FollowStats from "@/components/page_components/follow/FollowStats"
import PublicProfileActions from "@/components/page_components/public_profile/PublicProfileActions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Building2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"
import { pageVariants, listVariants, itemVariants } from "@/lib/animations"

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  if (!id) return <p className="text-sm text-destructive">Invalid profile URL</p>
  if (session?.user.id === id) return <Navigate to="/profile" replace />
  return <PublicProfileContent userId={id} />
}

const roleBadgeStyle: Record<string, string> = {
  MENTOR: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/60",
  ADMIN: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  USER: "bg-transparent text-muted-foreground border border-border/60",
}

function PublicProfileContent({ userId }: { userId: string }) {
  const shouldReduce = useReducedMotion()
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

  if (loading) return <ProfileSkeleton />
  if (error || !profile) {
    return <p className="py-8 text-center text-sm text-destructive">{error || "User not found"}</p>
  }

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      {/* Profile card */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Cover strip */}
        <div className="h-20 bg-gradient-to-r from-slate-100 to-slate-200/50 dark:from-slate-800/60 dark:to-slate-900/60" />

        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar className="h-20 w-20 ring-4 ring-card shadow-md">
              <AvatarImage src={profile.profileImage ?? undefined} />
              <AvatarFallback className="text-2xl font-semibold">
                {profile.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="mb-0.5">
              <PublicProfileActions
                userId={userId}
                counts={counts}
                onFollowChange={(isFollowing) =>
                  setCounts((prev) =>
                    prev ? { ...prev, followers: isFollowing ? prev.followers + 1 : prev.followers - 1, isFollowing } : prev
                  )
                }
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-foreground">{profile.name}</h1>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                roleBadgeStyle[profile.role] ?? roleBadgeStyle.USER
              )}>
                {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}
              </span>
            </div>

            {profile.bio && (
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80 max-w-md">{profile.bio}</p>
            )}

            {(profile.college || profile.hospital) && (
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {profile.college && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    {profile.college}
                  </span>
                )}
                {profile.hospital && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    {profile.hospital}
                  </span>
                )}
              </div>
            )}
          </div>

          {counts && (
            <div className="mt-4 border-t border-border/60 pt-4">
              <FollowStats userId={userId} followers={counts.followers} following={counts.following} />
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Posts</h2>
          {posts.length > 0 && (
            <span className="text-xs text-muted-foreground">({posts.length})</span>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          </div>
        ) : (
          <motion.div
            variants={shouldReduce ? {} : listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-3"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={shouldReduce ? {} : itemVariants}>
                <PostCard post={post} onLikeToggle={handleLikeToggle} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}