import { Link } from '@tanstack/react-router'
import type { ProductType } from '@/types'
import { ProdcutPrice } from './components/prodcut-price'
import { ProductBadge } from './components/product-badge'
import { ProductImage } from './components/product-image'
import { ProductTitle } from './components/product-title'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { WishlistControls } from './components/wishlist-controls'

export function Product({
  id,
  name,
  images,
  currency,
  price,
  discount_percentage,
  final_price,
  isWishlistProduct = false,
}: Partial<ProductType> & { isWishlistProduct?: boolean }) {
  return (
    <article
      className={cn(
        'h-[467px] w-full max-w-[230px] select-none overflow-x-hidden rounded-[12px] border border-[#DDDDDD] bg-white p-2',
        isWishlistProduct && 'h-fit',
      )}>
      <Link
        to="/$title/$productId"
        params={{ productId: id || '', title: name?.replace(/\s+/g, '-') || '' }}
        className="h-full w-full"
        preload="intent">
        <ProductImage images={images?.map((img) => img.image_url) || []} />
        <ProductTitle name={name || ''} />
        <div className="my-2 flex w-fit items-center justify-center space-x-2 rounded-[6px] bg-[#f3f4f8] px-[6px] py-[4px]">
          <div className="flex items-center space-x-1">
            <Star fill="#008000" color="#008000" size={14} />
            <div className="font-semibold text-[13px]">4.6</div>
          </div>
          <div className="text-[#9ba0b1] text-[13px]">
            <span>(20.6K)</span>
          </div>
        </div>
        <ProdcutPrice
          price={price || 0}
          currency={currency || ''}
          final_price={final_price || 0}
          discount_percentage={discount_percentage}
        />
        <ProductBadge />
      </Link>
      {isWishlistProduct && <WishlistControls productId={id} />}
    </article>
  )
}
