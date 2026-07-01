import { cn } from "@/lib/utils"

interface Props {
  imageUrls: string[]
  onImageClick?: (index: number) => void
  size?: "compact" | "full"
}

export default function PostImageGrid({ imageUrls, onImageClick, size = "compact" }: Props) {
  if (imageUrls.length === 0) return null

  const tileHeight = size === "compact" ? "h-64" : "h-[420px]"
  const halfTileHeight = size === "compact" ? "h-32" : "h-[210px]" // for 2-row layouts, each row is half

  return (
    <div className="mt-3 overflow-hidden rounded-lg">
      {imageUrls.length === 1 && (
        <Tile url={imageUrls[0]} index={0} onImageClick={onImageClick} className={cn("w-full", tileHeight)} />
      )}

      {imageUrls.length === 2 && (
        <div className={cn("grid grid-cols-2 gap-1", tileHeight)}>
          <Tile url={imageUrls[0]} index={0} onImageClick={onImageClick} className="h-full w-full" />
          <Tile url={imageUrls[1]} index={1} onImageClick={onImageClick} className="h-full w-full" />
        </div>
      )}

      {imageUrls.length === 3 && (
        <div className={cn("flex gap-1", tileHeight)}>
          <Tile url={imageUrls[0]} index={0} onImageClick={onImageClick} className="h-full w-1/2" />
          <div className="flex w-1/2 flex-col gap-1">
            <Tile url={imageUrls[1]} index={1} onImageClick={onImageClick} className={cn("w-full", halfTileHeight)} />
            <Tile url={imageUrls[2]} index={2} onImageClick={onImageClick} className={cn("w-full", halfTileHeight)} />
          </div>
        </div>
      )}

      {imageUrls.length === 4 && (
        <div className={cn("flex flex-col gap-1", tileHeight)}>
          <div className="flex h-1/2 gap-1">
            <Tile url={imageUrls[0]} index={0} onImageClick={onImageClick} className="h-full w-1/2" />
            <Tile url={imageUrls[1]} index={1} onImageClick={onImageClick} className="h-full w-1/2" />
          </div>
          <div className="flex h-1/2 gap-1">
            <Tile url={imageUrls[2]} index={2} onImageClick={onImageClick} className="h-full w-1/2" />
            <Tile url={imageUrls[3]} index={3} onImageClick={onImageClick} className="h-full w-1/2" />
          </div>
        </div>
      )}
    </div>
  )
}

function Tile({
  url,
  index,
  onImageClick,
  className,
}: {
  url: string
  index: number
  onImageClick?: (index: number) => void
  className?: string
}) {
  return (
    <div
      className={cn("relative shrink-0 cursor-pointer overflow-hidden bg-muted", className)}
      onClick={(e) => {
        e.stopPropagation()
        onImageClick?.(index)
      }}
    >
      <img src={url} alt={`Post image ${index + 1}`} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  )
}