import type { ProductType } from '@/types'

export type CartItemType = ProductType & { product_id: ProductType['id'] }

export type CartResponseType = {
  getCartItems: {
    cartItems: CartItemType[]
    message: string
    success: boolean
  }
}
