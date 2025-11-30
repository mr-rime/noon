import { ImageSlider } from '../../ui/image-slider'
import { ProductCartButton } from './prodcut-cart-button'
import { ProductWishlistButton } from './product-wishlist-button'

export function ProductImage({
  images,
  product_id,
  is_in_wishlist,
  wishlist_id,
  isWishlistProduct,
  height = 290,
}: {
  images: string[]
  product_id: string
  wishlist_id: string
  is_in_wishlist: boolean
  isWishlistProduct: boolean
  height?: number
}) {
  return (
    <div className="relative w-full rounded-[12px] bg-[#F6F6F7]" style={{ minHeight: `${height - 1}px` }} aria-label="Product image section">
      {!isWishlistProduct && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <ProductWishlistButton
            key={`wishlist-${is_in_wishlist}`}
            product_id={product_id}
            is_in_wishlist={is_in_wishlist}
            wishlist_id={wishlist_id}
          />
        </div>
      )}

      <ImageSlider
        images={images}
        mobileImages={images}
        autoPlay={false}
        showDots={true}
        dotsTheme="theme2"
        showControls={false}
        showProductControls={true}
        showProductDots={true}
        scaleOnHover={true}
        height={height}
        disableDragDesktop={true}
        rounded={true}
      />

      <div className="absolute right-2.5 bottom-2.5 z-10">
        <ProductCartButton />
      </div>
    </div>
  )
}
