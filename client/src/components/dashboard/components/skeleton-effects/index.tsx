import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

export function RevenueChartSkeleton() {
  return (
    <div className="mt-10 h-[300px] w-full space-y-2 ">
      <Skeleton className="h-full w-full rounded-[10px]" />
    </div>
  )
}

export function TableSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('mt-10 h-[300px] w-full space-y-2', className)}>
      <Skeleton className="h-full w-full rounded-[10px]" />
    </div>
  )
}
