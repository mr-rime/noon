import { Link } from '@tanstack/react-router'
import type { ProductType } from '@/types'
import { ProductImage } from './components/product-image'
import { ProductTitle } from './components/product-title'
import { ProdcutPrice } from './components/prodcut-price'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { WishlistControls } from './components/wishlist-controls'
import { LOG_PRODUCT_VIEW } from '@/graphql/browsing-history'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { formatNumber } from '@/utils/format-number'

export function Product({
  id,
  name,
  images,
  currency,
  price,
  discount_percentage,
  final_price,
  is_in_wishlist,
  wishlist_id,
  rating,
  review_count,
  isWishlistProduct = false,
  className,
  imageHeight = 290,
}: Partial<ProductType> & { isWishlistProduct?: boolean; className?: string; imageHeight?: number }) {
  const [viewLogged, setViewLogged] = useState(false)
  const [logView] = useMutation(LOG_PRODUCT_VIEW)

  const productImages = images
    ? [...images].sort(
      (a, b) => Number(b.is_primary ?? false) - Number(a.is_primary ?? false)
    )
    : []

  const handleLogView = () => {
    if (id && !viewLogged) {
      logView({ variables: { productId: id } })
        .then(res => console.log(res.data.logProductView.message))
        .catch(err => console.error('Log view error:', err))
      setViewLogged(true)
    }
  }

  return (
    <article
      className={cn(
        'h-fit min-h-[400px] select-none overflow-hidden rounded-[12px] border border-[#DDDDDD] bg-white p-2 sm:p-3',
        isWishlistProduct && 'h-fit',
        className
      )}>
      <Link
        to="/$title/$productId"
        params={{ title: name || 'product', productId: id || "" }}
        className="block h-full cursor-pointer"
        preload="intent"
        onClick={handleLogView}
      >
        <ProductImage
          images={productImages?.map((img) => img.image_url) || []}
          product_id={id!}
          wishlist_id={wishlist_id!}
          isWishlistProduct={isWishlistProduct}
          is_in_wishlist={is_in_wishlist!}
          height={imageHeight}
        />
        <ProductTitle name={name || ''} />

        <div className="my-2 flex w-fit items-center justify-center space-x-2 rounded-[6px] bg-[#f3f4f8] px-[6px] py-[4px]">
          <div className="flex items-center space-x-1">
            <Star fill="#008000" color="#008000" size={14} />
            <div className="font-semibold text-[13px]">
              {rating ? rating.toFixed(1) : '0.0'}
            </div>
          </div>
          <div className="text-[#374151] text-[13px]">
            <span>({formatNumber(review_count || 0)})</span>
          </div>
        </div>
        <ProdcutPrice
          price={price || 0}
          currency={currency || ''}
          final_price={final_price || 0}
          discount_percentage={discount_percentage}
        />
      </Link>
      {isWishlistProduct && <WishlistControls productId={id} />}
    </article>
  )
}
