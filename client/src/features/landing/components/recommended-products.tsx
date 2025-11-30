import { Product } from '@/shared/components/product/product'
import { ProductsListSkeleton } from '@/shared/components/ui/products-list-skeleton'
import type { ProductType } from '@/shared/types'

type RecommendedProductsProps = {
  products: ProductType[]
  loading: boolean
}

export default function RecommendedProducts({ products = [], loading }: RecommendedProductsProps) {
  const items = (products || []).slice(0, 20)

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[200px] w-full items-center bg-white px-2 py-4 md:px-4">
        <div className="w-full">
          <ProductsListSkeleton />
        </div>
      </div>
    )
  }

  if (!loading && items.length === 0) {
    return null
  }

  return (
    <div className="min-h-[200px] w-full bg-white px-2 py-4 md:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {items.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}
