import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface Props {
  onFilesSelected: (files: File[]) => void
}

const MAX_IMAGES = 4

export default function ImageUploadField({ onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

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
        <div className="grid grid-cols-4 gap-2">
          {previews.map((p, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={p.url} alt={`Selected ${i + 1}`} className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => handleRemove(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {previews.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed py-6 text-muted-foreground transition-colors hover:bg-accent"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-sm">
            Add image{previews.length > 0 ? "s" : ""} ({previews.length}/{MAX_IMAGES})
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