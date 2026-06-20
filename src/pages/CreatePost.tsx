import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { postApi } from "@/api/post.api"
import PostTypeToggle from "@/components/page_components/create_post/PostTypeToggle"
import ImageUploadField from "@/components/page_components/create_post/ImageUploadField"

export default function CreatePost() {
  const navigate = useNavigate()
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleToggleAnonymous(value: boolean) {
    setIsAnonymous(value)
    if (value) setImageFile(null)  // anonymous posts can't have images
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError("Post content can't be empty")
      return
    }

    setLoading(true)
    setError("")

    try {
      // TODO: when Cloudinary is added, upload imageFile here first and get a URL
      const imageUrl = undefined

      await postApi.createPost({
        content: content.trim(),
        isAnonymous,
        imageUrl,
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
          <ImageUploadField onFileSelected={setImageFile} />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading || !content.trim()} className="w-full">
          {loading ? "Posting..." : "Post"}
        </Button>
      </form>
    </div>
  )
}