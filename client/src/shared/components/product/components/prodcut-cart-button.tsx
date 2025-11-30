import { product_icons } from '../constants/icons'

export function ProductCartButton() {
  return (
    <button aria-label='Add to cart' name='cart' className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[6px] bg-white shadow-md transition-colors hover:bg-white/90">
      {product_icons.addCartIcon}
    </button>
  )
}
