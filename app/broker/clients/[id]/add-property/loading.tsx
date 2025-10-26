import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-96 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  )
}
