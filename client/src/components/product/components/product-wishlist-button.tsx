import { product_icons } from '../constants/icons'

export function ProductWishlistButton() {
  return (
    <button className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-white shadow-md transition-colors hover:bg-white/90">
      {product_icons.wishlist2}
    </button>
  )
}
