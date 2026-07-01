import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { postApi } from "@/api/post.api"
import { uploadApi } from "@/api/upload.api"
import PostTypeToggle from "@/components/page_components/create_post/PostTypeToggle"
import ImageUploadField from "@/components/page_components/create_post/ImageUploadField"

export default function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleToggleAnonymous(value: boolean) {
    setIsAnonymous(value)
    if (value) setImageFiles([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      setError("Post title can't be empty")
      return
    }
    if (!content.trim()) {
      setError("Post content can't be empty")
      return
    }

    setLoading(true)
    setError("")

    try {
      let imageUrls: string[] = []

      if (!isAnonymous && imageFiles.length > 0) {
        const res = await uploadApi.uploadPostImages(imageFiles)
        imageUrls = res.data.urls
      }

      await postApi.createPost({
        title: title.trim(),
        content: content.trim(),
        isAnonymous,
        imageUrls,
      })

      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Create post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PostTypeToggle isAnonymous={isAnonymous} onToggle={handleToggleAnonymous} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your post a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>

        <Textarea
          placeholder={
            isAnonymous
              ? "Share something on your mind. No one will know it's you..."
              : "What's on your mind?"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="resize-none"
        />

        {!isAnonymous && (
          <ImageUploadField onFilesSelected={setImageFiles} />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading || !title.trim() || !content.trim()} className="w-full">
          {loading ? "Posting..." : "Post"}
        </Button>
      </form>
    </div>
  )
}