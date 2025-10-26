import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Skeleton className="h-10 w-48 mb-6" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
