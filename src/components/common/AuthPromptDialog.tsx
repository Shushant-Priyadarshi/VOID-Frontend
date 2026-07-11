import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthPromptDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/40">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="7" y="2" width="2" height="12" rx="0.5" fill="currentColor" className="text-teal-600 dark:text-teal-400" />
              <rect x="2" y="7" width="12" height="2" rx="0.5" fill="currentColor" className="text-teal-600 dark:text-teal-400" />
            </svg>
          </div>
          <DialogTitle className="text-base font-bold">Join the conversation</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Sign in to like posts, leave comments, and connect with doctors and medical students.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-1">
          <Button
            onClick={() => { navigate("/signup"); onOpenChange(false) }}
            className="h-10 w-full bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            Create a free account
          </Button>
          <Button
            variant="outline"
            onClick={() => { navigate("/login"); onOpenChange(false) }}
            className="h-10 w-full border-border/60"
          >
            Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}