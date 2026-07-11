import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState, useEffect } from "react"

interface Props {
  imageUrls: string[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImageLightbox({ imageUrls, initialIndex, open, onOpenChange }: Props) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (open) setIndex(initialIndex)
  }, [open, initialIndex])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1))
      if (e.key === "ArrowRight") setIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1))
      if (e.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, imageUrls.length, onOpenChange])

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1))
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-none bg-black/95 p-0 shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex min-h-[50vh] items-center justify-center p-4">
          <img
            src={imageUrls[index]}
            alt={`Image ${index + 1} of ${imageUrls.length}`}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
          />

          {imageUrls.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                {imageUrls.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-4 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}