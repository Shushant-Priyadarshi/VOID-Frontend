import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface Props {
  onFileSelected: (file: File | null) => void
}

export default function ImageUploadField({ onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    onFileSelected(file)

    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  function handleRemove() {
    setPreview(null)
    onFileSelected(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  if (preview) {
    return (
      <div className="relative">
        <img src={preview} alt="Selected" className="max-h-64 w-full rounded-lg object-cover" />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-muted-foreground transition-colors hover:bg-accent"
    >
      <ImagePlus className="h-6 w-6" />
      <span className="text-sm">Add an image</span>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </button>
  )
}