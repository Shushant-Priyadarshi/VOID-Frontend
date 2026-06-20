import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyPostsTab, type ProfileTab } from "@/hooks/useMyPostsTab"
import MyPostCard from "./MyPostCard"
import { postApi } from "@/api/post.api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function TabPanel({ tab }: { tab: ProfileTab }) {
  const { posts, setPosts, loading, error } = useMyPostsTab(tab)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

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

  async function confirmDelete() {
    if (!deleteTarget) return
    await postApi.deletePost(deleteTarget)
    setPosts((prev) => prev.filter((p) => p.id !== deleteTarget))
    setDeleteTarget(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3 pt-4">
        {[1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
      </div>
    )
  }

  if (error) return <p className="pt-4 text-sm text-destructive">{error}</p>

  if (posts.length === 0) {
    return (
      <p className="pt-8 text-center text-sm text-muted-foreground">
        {tab === "created" && "You haven't posted anything yet."}
        {tab === "liked" && "You haven't liked any posts yet."}
        {tab === "commented" && "You haven't commented on any posts yet."}
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3 pt-4">
        {posts.map((post) => (
          <MyPostCard
            key={post.id}
            post={post}
            onLikeToggle={handleLikeToggle}
            onDelete={tab === "created" ? (id) => setDeleteTarget(id) : undefined}
          />
        ))}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This post will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function ProfilePostsTabs() {
  return (
    <Tabs defaultValue="created" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="created">Posts</TabsTrigger>
        <TabsTrigger value="liked">Liked</TabsTrigger>
        <TabsTrigger value="commented">Commented</TabsTrigger>
      </TabsList>

      <TabsContent value="created">
        <TabPanel tab="created" />
      </TabsContent>
      <TabsContent value="liked">
        <TabPanel tab="liked" />
      </TabsContent>
      <TabsContent value="commented">
        <TabPanel tab="commented" />
      </TabsContent>
    </Tabs>
  )
}