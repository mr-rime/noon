import { ProductSkeleton } from '@/shared/components/product/components/product-skeleton'

export function ProductsListSkeleton() {
  return (
    <div className="flex w-full items-center gap-[16px] overflow-hidden ">
      {Array.from({ length: 5 }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  )
}
