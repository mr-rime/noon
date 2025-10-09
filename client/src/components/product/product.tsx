import { Link } from '@tanstack/react-router'
import type { ProductType } from '@/types'
import { ProdcutPrice } from './components/prodcut-price'
import { ProductBadge } from './components/product-badge'
import { ProductImage } from './components/product-image'
import { ProductTitle } from './components/product-title'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { WishlistControls } from './components/wishlist-controls'
import { useQuery } from '@apollo/client'
import { GET_PRODUCT } from '@/graphql/product'
import { useState } from 'react'

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
  psku,
  category_name,
  brand_name,
  isWishlistProduct = false,
}: Partial<ProductType> & { isWishlistProduct?: boolean }) {
  const [hasFetched, setHasFetched] = useState(false)
  const { refetch } = useQuery(GET_PRODUCT, { variables: { id }, skip: true })


  const productImages = images
    ? [...images].sort(
      (a, b) => Number(b.is_primary ?? false) - Number(a.is_primary ?? false)
    )
    : []

  const handlePrefetch = async () => {
    if (!hasFetched) {
      await refetch({ fetchPolicy: 'network-only' })
    }

    setHasFetched(true)
  }

  return (
    <article
      onMouseEnter={handlePrefetch}
      className={cn(
        'h-[467px] w-full max-w-[230px] select-none overflow-x-hidden rounded-[12px] border border-[#DDDDDD] bg-white p-2',
        isWishlistProduct && 'h-fit',
      )}>
      <Link
        to="/$title/$productId"
        params={{ productId: id || '', title: name?.replace(/\s+/g, '-') || '' }}
        className="h-full w-full"
        preload="intent">
        <ProductImage
          images={productImages?.map((img) => img.image_url) || []}
          product_id={id!}
          wishlist_id={wishlist_id!}
          isWishlistProduct={isWishlistProduct}
          is_in_wishlist={is_in_wishlist!}
        />
        <ProductTitle name={name || ''} />

        {/* PSKU and Category Info */}
        {(psku || category_name || brand_name) && (
          <div className="my-2 space-y-1">
            {psku && (
              <div className="text-xs text-muted-foreground font-mono">
                PSKU: {psku}
              </div>
            )}
            {(category_name || brand_name) && (
              <div className="flex flex-wrap gap-1">
                {category_name && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {category_name}
                  </span>
                )}
                {brand_name && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {brand_name}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

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
