import { Skeleton } from '@/components/ui/skeleton'

export function ProductPageLoadingSkeleton() {
  return (
    <main aria-label="Product Page" className="!scroll-smooth mb-32 overflow-x-hidden bg-[#F7F7FA]">
      <section
        aria-labelledby="product-main-section"
        className="site-container relative flex w-full flex-col items-start justify-start space-y-10 px-5 pt-10 lg:flex-row lg:space-x-10 lg:space-y-0 ">
        <div className="w-full md:w-[calc(300/1200*100%)]">
          <Skeleton className="mb-5 hidden h-[50px] w-full rounded-[6px] max-md:block" />
          <Skeleton className="h-[450px] w-full rounded-[6px]" />
        </div>

        <div
          className="flex w-full flex-col items-start justify-center gap-3 lg:w-[calc(500/1200*100%)]"
          aria-labelledby="product-info-section">
          <Skeleton className="h-[30px] w-full rounded-[6px]" />
          <Skeleton className="h-[25px] w-full rounded-[6px]" />
          <Skeleton className="h-[25px] w-full rounded-[6px]" />
          <Skeleton className="mt-8 h-[50px] w-[150px] rounded-[6px] max-md:w-full" />
          <Skeleton className="h-[50px] w-[150px] rounded-[6px] max-md:w-full " />
        </div>
        <div className="hidden md:block">
          <div className="mt-2 flex items-center space-x-2">
            <Skeleton className="h-[25px] w-full rounded-[6px]" />
          </div>
        </div>
        <div className="block space-y-3 max-md:hidden">
          <Skeleton className="h-[350px] w-[300px] rounded-[6px]" />
          <Skeleton className="h-[45px] w-full rounded-[6px]" />
        </div>
      </section>
    </main>
  )
}
