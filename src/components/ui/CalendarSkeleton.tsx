import { Skeleton } from "./skeleton"

export function CalendarSkeleton() {
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
      <main className="flex-1 bg-white">
        <div className="max-w-8xl mx-auto h-full flex flex-col">
          {/* Header Skeleton */}
          <header className="flex justify-between items-center p-4 bg-white border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Search and Controls Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </header>

          {/* Calendar Grid Skeleton */}
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              {/* Team Members Header */}
              <div className="grid gap-1 min-w-[800px]" style={{ gridTemplateColumns: '200px repeat(5, 1fr)' }}>
                <div className="p-4 border-b border-r border-gray-200 bg-gray-50">
                  <Skeleton className="h-5 w-24" />
                </div>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 border-b border-r border-gray-200 bg-gray-50">
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-6 w-8" />
                  </div>
                ))}
              </div>

              {/* Team Rows Skeleton */}
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid gap-1 min-w-[800px]" style={{ gridTemplateColumns: '200px repeat(5, 1fr)' }}>
                  {/* Team Member Cell */}
                  <div className="p-4 border-b border-r border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>

                  {/* Day Cells */}
                  {Array.from({ length: 5 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="p-2 border-b border-r border-gray-200 bg-white min-h-[120px]">
                      {/* Task Cards Skeleton */}
                      {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, taskIndex) => (
                        <div key={taskIndex} className="p-2 rounded border mb-2">
                          <Skeleton className="h-3 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
