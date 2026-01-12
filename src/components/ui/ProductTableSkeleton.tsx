import { Skeleton } from "./skeleton"

export function ProductTableSkeleton() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Skeleton */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
      </header>

      {/* Filter Bar Skeleton */}
      <div className="flex items-center px-6 py-2 bg-white border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-12 gap-4">
              <Skeleton className="h-5 w-20 col-span-3" />
              <Skeleton className="h-5 w-16 col-span-2" />
              <Skeleton className="h-5 w-12 col-span-1" />
              <Skeleton className="h-5 w-14 col-span-2" />
              <Skeleton className="h-5 w-18 col-span-2" />
              <Skeleton className="h-5 w-16 col-span-2" />
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border-b border-gray-100 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-5 w-16 col-span-2" />
                <div className="col-span-1 flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-5 w-14 col-span-2" />
                <Skeleton className="h-5 w-18 col-span-2" />
                <div className="col-span-2 flex items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
