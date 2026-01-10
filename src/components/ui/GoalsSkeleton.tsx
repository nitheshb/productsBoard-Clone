import { Skeleton } from "./skeleton"

export function GoalsSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <Skeleton className="h-8 w-32 mb-6" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg mb-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-full mx-auto relative">
          {/* Header Skeleton */}
          <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white border-b overflow-visible">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Search and Controls Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-5 w-16" />
            </div>
          </header>

          <div className="p-4">
            {/* Timeline Header Skeleton */}
            <div className="w-full">
              <div className="w-full">
                <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
                  <div className="flex">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="border-r border-gray-200 flex-1">
                        <div className="p-2 bg-gray-50 text-center">
                          <Skeleton className="h-5 w-16 mx-auto" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Rows Skeleton */}
                {Array.from({ length: 3 }).map((_, statusIndex) => (
                  <div key={statusIndex} className="border-b border-gray-100">
                    {/* Section Header */}
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-4 rounded" />
                      </div>
                    </div>

                    {/* Timeline Rows */}
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, goalIndex) => (
                        <div key={goalIndex} className="flex">
                          <div className="flex-1 relative">
                            <div className="grid grid-cols-4 h-20 relative">
                              <div className="absolute top-2 left-4 right-4 h-16 rounded-md border-l-4 border-gray-300 bg-gray-50">
                                <div className="p-2 h-full flex flex-col justify-between">
                                  <Skeleton className="h-3 w-24" />
                                  <Skeleton className="h-3 w-20" />
                                  <div className="flex items-center gap-2 mt-1">
                                    <Skeleton className="h-1.5 w-16 rounded-full" />
                                    <Skeleton className="h-3 w-6" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
