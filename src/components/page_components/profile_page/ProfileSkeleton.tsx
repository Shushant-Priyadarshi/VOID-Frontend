import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="h-20 bg-muted" />
      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end justify-between">
          <Skeleton className="h-20 w-20 rounded-full ring-4 ring-card" />
          <Skeleton className="mb-0.5 h-8 w-24 rounded-md" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-52 rounded" />
          <Skeleton className="h-3.5 w-64 rounded" />
        </div>
        <div className="mt-4 flex gap-4 border-t border-border/60 pt-4">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  )
}