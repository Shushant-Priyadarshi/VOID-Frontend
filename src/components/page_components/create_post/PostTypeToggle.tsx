import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { EyeOff, Eye } from "lucide-react"

interface Props {
  isAnonymous: boolean
  onToggle: (value: boolean) => void
}

export default function PostTypeToggle({ isAnonymous, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-2">
        {isAnonymous ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <div>
          <Label htmlFor="anon-toggle" className="text-sm font-medium">
            {isAnonymous ? "Posting anonymously" : "Posting with your name"}
          </Label>
          <p className="text-xs text-muted-foreground">
            {isAnonymous
              ? "Your identity will be hidden. Shown only as your role and institution."
              : "Your name and photo will be visible on this post."}
          </p>
        </div>
      </div>
      <Switch id="anon-toggle" checked={isAnonymous} onCheckedChange={onToggle} />
    </div>
  )
}