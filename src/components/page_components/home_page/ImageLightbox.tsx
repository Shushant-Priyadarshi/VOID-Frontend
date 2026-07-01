import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Props {
  imageUrls: string[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImageLightbox({ imageUrls, initialIndex, open, onOpenChange }: Props) {
  const [index, setIndex] = useState(initialIndex)

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1))
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1))
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (o) setIndex(initialIndex) }}>
      <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
        <div className="relative flex items-center justify-center">
          <img
            src={imageUrls[index]}
            alt={`Image ${index + 1}`}
            className="max-h-[85vh] w-full rounded-lg object-contain"
          />

          {imageUrls.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                onClick={prev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                onClick={next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
                {index + 1} / {imageUrls.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}