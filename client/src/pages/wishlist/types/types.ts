export type WishlistType = {
  id: string
  user_id: string
  name: string
  is_private: boolean
  is_default: boolean
  item_count: number
  created_at: string
}

type WishlistIdentifier =
  | 'updateWishlist'
  | 'getWishlists'
  | 'createWishlist'
  | 'getWishlistItems'
  | 'addWishlistItem'
  | 'removeWishlistItem'
  | 'clearWishlist'
  | 'deleteWishlist'

export type WishlistResponse<T extends WishlistIdentifier, R extends unknown> = {
  [K in T]: {
    success: boolean
    message: string
    data: R
  }
}
