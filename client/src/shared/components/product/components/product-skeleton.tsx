import { Skeleton } from '@/shared/components/ui/skeleton'

export function ProductSkeleton() {
  return (
    <article className="h-[467px] w-full max-w-[230px] shrink-0 select-none overflow-x-hidden rounded-[12px] border border-[#DDDDDD] bg-white p-2">
      <div className="flex h-full w-full flex-col gap-2">
        <Skeleton className="h-[200px] w-full rounded-[8px]" />
        <Skeleton className="h-[20px] w-[80%] rounded" />
        <Skeleton className="h-[20px] w-[60%] rounded" />
        <Skeleton className="h-[24px] w-[50px] rounded-full" />
      </div>
    </article>
  )
}
