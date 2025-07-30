import type { ProductType } from '@/types'

export type WishlistType = {
  id: string
  user_id: string
  name: string
  is_private: boolean
  is_default: boolean
  item_count: number
  created_at: string
}

export type WishlistItemsResponseType = {
  getWishlistItems: {
    success: boolean
    message: string
    data: ProductType[]
  }
}

export type WishlistsResponseType = {
  getWishlists: {
    success: boolean
    message: string
    data: WishlistType[]
  }
}
