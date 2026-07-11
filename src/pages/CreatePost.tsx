import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { postApi } from "@/api/post.api"
import { uploadApi } from "@/api/upload.api"
import PostTypeToggle from "@/components/page_components/create_post/PostTypeToggle"
import ImageUploadField from "@/components/page_components/create_post/ImageUploadField"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { pageVariants, fadeVariants } from "@/lib/animations"
import { cn } from "@/lib/utils"

export default function CreatePost() {
  const navigate = useNavigate()
  const shouldReduce = useReducedMotion()
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
    if (!title.trim()) { setError("Post title can't be empty"); return }
    if (!content.trim()) { setError("Post content can't be empty"); return }

    setLoading(true)
    setError("")

    try {
      let imageUrls: string[] = []
      if (!isAnonymous && imageFiles.length > 0) {
        const res = await uploadApi.uploadPostImages(imageFiles)
        imageUrls = res.data.urls
      }
      await postApi.createPost({ title: title.trim(), content: content.trim(), isAnonymous, imageUrls })
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  const charCount = content.length
  const isReady = title.trim().length > 0 && content.trim().length > 0

  return (
    <motion.div
      variants={shouldReduce ? {} : pageVariants}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-xl"
    >
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Create post</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Share a question, insight, or experience with the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Mode toggle — sits above form to signal the mode first */}
        <PostTypeToggle isAnonymous={isAnonymous} onToggle={handleToggleAnonymous} />

        {/* Form card — shifts border color based on mode */}
        <div className={cn(
          "rounded-xl border bg-card transition-colors duration-300",
          isAnonymous ? "border-slate-300/60 dark:border-slate-700/60" : "border-border"
        )}>
          <div className="flex flex-col gap-0 divide-y divide-border/60">
            {/* Title */}
            <div className="px-4 py-3">
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="Give your post a clear title…"
                className="w-full bg-transparent text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <Textarea
                placeholder={
                  isAnonymous
                    ? "Share freely — your identity stays hidden. Your role and institution will appear instead."
                    : "What's on your mind? Ask a question, share a case, or spark a discussion…"
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                className="resize-none border-0 bg-transparent p-3 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Image upload — only for non-anonymous */}
            <AnimatePresence>
              {!isAnonymous && (
                <motion.div
                  key="image-upload"
                  variants={shouldReduce ? {} : fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="px-4 py-3"
                >
                  <ImageUploadField onFilesSelected={setImageFiles} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom bar with char count */}
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5">
            <span className={cn(
              "text-xs tabular-nums transition-colors",
              charCount > 2800 ? "text-destructive" : "text-muted-foreground/50"
            )}>
              {charCount > 0 ? `${charCount} characters` : ""}
            </span>
            <span className="text-xs text-muted-foreground/50">
              {title.length > 0 ? `${120 - title.length} chars left in title` : ""}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            variants={shouldReduce ? {} : fadeVariants}
            initial="initial"
            animate="animate"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2"
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || !isReady}
          className="h-10 w-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Publishing…
            </span>
          ) : (
            isAnonymous ? "Publish anonymously" : "Publish post"
          )}
        </Button>
      </form>
    </motion.div>
  )
}