import { cn } from '@/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn(`relative h-[10px] w-[50px] overflow-hidden bg-[#e4e4e7]`, className)} {...props}>
      <div className="shimmer-overlay" />
    </div>
  )
}
