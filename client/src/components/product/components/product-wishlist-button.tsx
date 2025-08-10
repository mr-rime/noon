import { useMutation, useQuery } from '@apollo/client'
import { ADD_WISHLIST_ITEM, GET_WISHLIST_ITEMS, GET_WISHLISTS } from '@/graphql/wishlist'
import type { WishlistResponse, WishlistType } from '@/pages/wishlist'
import { toast } from 'sonner'
import { cn } from '@/utils/cn'
import { Wishlist2 } from '../constants'
import { useMemo, useState } from 'react'

export function ProductWishlistButton({ product_id, is_in_wishlist }: { product_id: string; is_in_wishlist: boolean }) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { data: wishlistsData } = useQuery<WishlistResponse<'getWishlists', WishlistType[]>>(GET_WISHLISTS)
  const defaultWishlist = useMemo(
    () => wishlistsData?.getWishlists.data.find((wishlist) => wishlist.is_default === true),
    [wishlistsData],
  )
  const [addWishlistItem, { loading }] = useMutation<WishlistResponse<'addWishlistItem', WishlistType>>(
    ADD_WISHLIST_ITEM,
    {
      refetchQueries: () => [
        GET_WISHLISTS,
        {
          query: GET_WISHLIST_ITEMS,
          variables: { wishlist_id: defaultWishlist?.id },
        },
      ],
      awaitRefetchQueries: true,
    },
  )

  const handleAddWishlistItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsInWishlist(true)
    const { data } = await addWishlistItem({ variables: { product_id } })
    const res = data?.addWishlistItem
    if (res?.success) {
      toast.success(res.message || 'Product added to wishlist')
    } else {
      toast.error(res?.message || 'Error adding product to wishlist')
    }
  }

  return is_in_wishlist || isInWishlist ? (
    <button
      className={
        'flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-white shadow-md transition-colors hover:bg-white/90'
      }>
      <Wishlist2 className={'h-4 w-4 fill-[#3866DF] text-[#3866DF]'} />
    </button>
  ) : (
    <button
      onClick={handleAddWishlistItem}
      className={cn(
        'flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-white shadow-md transition-colors hover:bg-white/90',
      )}>
      <Wishlist2 className={cn('h-4 w-4', is_in_wishlist && 'fill-[#3866DF] text-[#3866DF]')} />
    </button>
  )
}
