import { useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

interface Props {
  onFilesSelected: (files: File[]) => void
}

const MAX_IMAGES = 4

export default function ImageUploadField({ onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const shouldReduce = useReducedMotion()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    const combined = [...previews.map((p) => p.file), ...selected].slice(0, MAX_IMAGES)
    const next = combined.map((file) => ({ file, url: URL.createObjectURL(file) }))
    setPreviews(next)
    onFilesSelected(next.map((p) => p.file))
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleRemove(index: number) {
    const next = previews.filter((_, i) => i !== index)
    setPreviews(next)
    onFilesSelected(next.map((p) => p.file))
  }

  return (
    <div className="flex flex-col gap-2">
      {previews.length > 0 && (
        <div className={cn(
          "grid gap-1.5",
          previews.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          <AnimatePresence>
            {previews.map((p, i) => (
              <motion.div
                key={p.url}
                initial={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
                animate={shouldReduce ? {} : { opacity: 1, scale: 1 }}
                exit={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <img src={p.url} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {previews.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg border border-dashed px-4 py-3 text-left text-muted-foreground transition-colors hover:border-teal-400/60 hover:bg-teal-50/30 hover:text-teal-600 dark:hover:bg-teal-950/20 dark:hover:text-teal-400",
            previews.length === 0 ? "justify-center py-5" : "justify-start"
          )}
        >
          <ImagePlus className="h-4 w-4 shrink-0" />
          <span className="text-sm">
            {previews.length === 0
              ? "Add photos (up to 4)"
              : `Add more photos (${previews.length}/${MAX_IMAGES})`}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleChange}
          />
        </button>
      )}
    </div>
  )
}