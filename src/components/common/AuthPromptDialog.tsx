import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Create an account or log in to like, comment, and connect with mentors.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => navigate("/signup")}>
            Create account
          </Button>
          <Button onClick={() => navigate("/login")}>
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}