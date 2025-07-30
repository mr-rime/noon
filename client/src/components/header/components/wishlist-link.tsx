import { header_icons } from '../constants'
import { useQuery } from '@apollo/client'
import { GET_WISHLISTS } from '@/graphql/wishlist'
import type { WishlistsResponseType } from '@/pages/wishlist'
import { Link } from '@tanstack/react-router'

export function WishlistLink() {
  const { data } = useQuery<WishlistsResponseType>(GET_WISHLISTS)

  const wishlist_item_count = data?.getWishlists.data.reduce((total, wishlist) => total + (wishlist.item_count || 0), 0)

  return (
    <div>
      <Link to="/wishlist" className="relative">
        {(wishlist_item_count || 0) > 0 && (
          <div className="-right-[8px] -top-2 absolute flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3866DF] font-semibold text-[10px] text-white">
            {wishlist_item_count}
          </div>
        )}
        {header_icons.heartIcon}
      </Link>
    </div>
  )
}
