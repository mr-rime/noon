import type { ProductType } from '@/types'
import { ProductPageDiscount } from './product-page-discount'

export function ProdcutPagePrice({
  price,
  currency,
  discount_percentage,
  final_price,
}: Pick<ProductType, 'currency' | 'final_price' | 'price' | 'discount_percentage'>) {
  return (
    <div className=" mt-6">
      <div className="flex items-center space-x-1 max-md:flex-col">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-[18px] md:text-[#101010] md:text-[16px]">{currency}</span>
          <strong className="text-[18px] md:text-[#1d2939] md:text-[24px]">{final_price?.toFixed(2)}</strong>
        </div>
        {final_price !== price && (
          <ProductPageDiscount discount_percentage={discount_percentage} currency={currency} price={price} />
        )}
      </div>
    </div>
  )
}
