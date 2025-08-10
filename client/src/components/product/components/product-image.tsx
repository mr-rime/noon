import { ImageSlider } from '../../ui/image-slider'
import { ProductCartButton } from './prodcut-cart-button'
import { ProductWishlistButton } from './product-wishlist-button'

export function ProductImage({
  images,
  product_id,
  is_in_wishlist,
  isWishlistProduct,
}: {
  images: string[]
  product_id: string
  is_in_wishlist: boolean
  isWishlistProduct: boolean
}) {
  return (
    <div className="relative min-h-[200px] w-full rounded-[12px] bg-[#F6F6F7]" aria-label="Product image section">
      {!isWishlistProduct && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <ProductWishlistButton product_id={product_id} is_in_wishlist={is_in_wishlist} />
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
        height={330}
        disableDragDesktop={true}
      />

      <div className="absolute right-2.5 bottom-2.5 z-10">
        <ProductCartButton />
      </div>
    </div>
  )
}
