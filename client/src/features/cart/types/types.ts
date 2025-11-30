import type { ProductType } from '@/shared/types'

export type CartItemType = ProductType & {
  product_id: ProductType['id']
  quantity: number
}

export type CartResponseType = {
  getCartItems: {
    cartItems: CartItemType[]
    message: string
    success: boolean
  }
}
