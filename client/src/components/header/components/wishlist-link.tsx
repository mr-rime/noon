import { header_icons } from '../constants'
import { useQuery } from '@apollo/client'
import { GET_WISHLISTS } from '@/graphql/wishlist'
import type { WishlistsResponseType } from '@/pages/wishlist'
import { useNavigate } from '@tanstack/react-router'

export function WishlistLink() {
  const { data } = useQuery<WishlistsResponseType>(GET_WISHLISTS)
  const navigate = useNavigate()
  const wishlist_item_count = data?.getWishlists.data.reduce((total, wishlist) => total + (wishlist.item_count || 0), 0)
  const wishlists = data?.getWishlists.data
  return (
    <button
      onClick={() => {
        navigate({ to: '/wishlist', search: { wishlistCode: wishlists?.[0].id } })
        console.log('yess')
      }}
      className="relative mr-3 h-fit w-fit cursor-pointer text-[#404553] transition-colors hover:text-[#8C8832]">
      {(wishlist_item_count || 0) > 0 && (
        <div className="-right-[8px] -top-2 absolute flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3866DF] font-semibold text-[10px] text-white">
          {wishlist_item_count}
        </div>
      )}
      {header_icons.heartIcon}
    </button>
  )
}
