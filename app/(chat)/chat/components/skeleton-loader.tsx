import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoader() {
  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden gap-4">
      {/* Sidebar Skeleton */}
      <div className="w-64 p-4 border-r">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
      </div>

      {/* Chat Interface Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Messages area */}
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-3/4 ml-auto" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-3/4 ml-auto" />
        </div>

        {/* Input area */}
        <div className="p-4 border-t">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}