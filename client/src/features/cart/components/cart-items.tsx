import { CartItem } from './cart-item'
import type { CartItemType } from '../types'

export function CartItems({ cartItems }: { cartItems: CartItemType[] }) {
  return (
    <section className="flex w-full flex-col gap-4">
      {cartItems.map((item) => (
        <CartItem key={item.product_id} {...item} />
      ))}
    </section>
  )
}
