import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl font-bold text-muted-foreground">404</span>
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Page not found</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link to="/">
        <Button className="gap-2 bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Button>
      </Link>
    </div>
  )
}