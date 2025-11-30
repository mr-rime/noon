import { Skeleton } from '@/shared/components/ui/skeleton'

export function CartLoadingSkeleton() {
  return (
    <main className="site-container mt-10 h-full w-full px-[45px] py-2">
      <h1 className="flex items-center space-x-1">
        <strong className="text-[23px]">Cart</strong>
      </h1>

      <section className="mt-5 flex w-full items-start justify-center space-x-7">
        <section className=" flex w-full max-w-[65%] flex-col items-center gap-3">
          <Skeleton className="h-[30px] w-full rounded-[6px]" />
          <Skeleton className="h-[200px] w-full rounded-[6px]" />
          <Skeleton className="h-[200px] w-full rounded-[6px]" />
        </section>

        <section className="sticky flex w-full max-w-[35%] flex-col items-center gap-3 rounded-[6px] rounded-t-none p-[0px_20px]">
          <Skeleton className="h-[30px] w-full rounded-[6px]" />
          <Skeleton className="h-[300px] w-full rounded-[6px]" />
          <Skeleton className="h-[100px] w-full rounded-[6px]" />
        </section>
      </section>
    </main>
  )
}
