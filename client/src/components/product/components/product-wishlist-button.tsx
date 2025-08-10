import { useMutation, useQuery } from '@apollo/client'
import { ADD_WISHLIST_ITEM, GET_WISHLIST_ITEMS, GET_WISHLISTS, REMOVE_WISHLIST_ITEM } from '@/graphql/wishlist'
import type { WishlistResponse, WishlistType } from '@/pages/wishlist'
import { toast } from 'sonner'
import { cn } from '@/utils/cn'
import { Wishlist2 } from '../constants'
import { useMemo, useState } from 'react'
import { GET_HOME } from '@/graphql/home'

export function ProductWishlistButton({
  product_id,
  is_in_wishlist,
  wishlist_id,
}: {
  product_id: string
  is_in_wishlist: boolean
  wishlist_id: string
}) {
  const [isInWishlist, setIsInWishlist] = useState(is_in_wishlist)

  const { data: wishlistsData } = useQuery<WishlistResponse<'getWishlists', WishlistType[]>>(GET_WISHLISTS)

  const defaultWishlist = useMemo(
    () => wishlistsData?.getWishlists.data.find((wishlist) => wishlist.is_default === true),
    [wishlistsData],
  )

  const [addWishlistItem, { loading: isAddingWishlistItem }] = useMutation<
    WishlistResponse<'addWishlistItem', WishlistType>
  >(ADD_WISHLIST_ITEM, {
    refetchQueries: () => [
      GET_WISHLISTS,
      GET_HOME,
      {
        query: GET_WISHLIST_ITEMS,
        variables: { wishlist_id: defaultWishlist?.id },
      },
    ],
    awaitRefetchQueries: true,
  })

  const [removeWishlistItem, { loading: isRemovingWishlistItem }] = useMutation<
    WishlistResponse<'removeWishlistItem', WishlistType>
  >(REMOVE_WISHLIST_ITEM, {
    refetchQueries: [
      GET_WISHLISTS,
      GET_HOME,
      {
        query: GET_WISHLIST_ITEMS,
        variables: { wishlist_id },
      },
    ],
    awaitRefetchQueries: true,
  })

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
      setIsInWishlist(false)
    }
  }

  const handleRemoveWishlistItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsInWishlist(false)

    const { data } = await removeWishlistItem({
      variables: { product_id, wishlist_id },
    })
    const res = data?.removeWishlistItem

    if (res?.success) {
      toast.success(res.message || 'Product removed from wishlist successfully')
    } else {
      toast.error(res?.message || 'Error removing product from wishlist')
      setIsInWishlist(true)
    }
  }

  const isLoading = isAddingWishlistItem || isRemovingWishlistItem

  return isInWishlist ? (
    <button
      onClick={handleRemoveWishlistItem}
      disabled={isLoading}
      className={cn(
        'flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-white shadow-md transition-opacity hover:bg-white/90',
        isLoading && 'cursor-not-allowed opacity-50',
      )}>
      <Wishlist2 className="h-4 w-4 fill-[#3866DF] text-[#3866DF]" />
    </button>
  ) : (
    <button
      onClick={handleAddWishlistItem}
      disabled={isLoading}
      className={cn(
        'flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] bg-white shadow-md transition-opacity hover:bg-white/90',
        isLoading && 'cursor-not-allowed opacity-50',
      )}>
      <Wishlist2 className="h-4 w-4" />
    </button>
  )
}
