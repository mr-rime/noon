import type { ProductType } from '@/types'

export function ProductDiscount({ price, discount_percentage }: Pick<ProductType, 'price' | 'discount_percentage'>) {
  return (
    <div aria-label="Product discount information" className="flex items-center space-x-1">
      <span aria-label="Discounted price" className="text-[#6b7184] text-[14px] line-through">
        {price}
      </span>
      <span aria-label="Discount percentage" className="font-bold text-[#38ae04] text-[13px]">
        {discount_percentage}%
      </span>
    </div>
  )
}
