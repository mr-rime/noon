import { cn } from '@/utils/cn'
import { HeartMinus } from 'lucide-react'
import type { WishlistResponse, WishlistType } from '../types'
import { useMutation } from '@apollo/client'
import { CLEAR_WISHLIST, GET_WISHLIST_ITEMS, GET_WISHLISTS } from '@/graphql/wishlist'
import { toast } from 'sonner'
import { GET_HOME } from '@/graphql/home'

export function EmptyWishlistButton({ currentWishlist }: { currentWishlist: WishlistType | undefined }) {
  const [clearWishlist] = useMutation<WishlistResponse<'clearWishlist', WishlistType>>(CLEAR_WISHLIST, {
    refetchQueries: [
      GET_WISHLISTS,
      {
        query: GET_WISHLIST_ITEMS,
        variables: { wishlist_id: currentWishlist?.id },
      },
      GET_HOME,
    ],
    awaitRefetchQueries: true,
  })

  const handleClearWishlist = async () => {
    const { data } = await clearWishlist({ variables: { wishlist_id: currentWishlist?.id } })

    const res = data?.clearWishlist

    if (res?.success) {
      toast.success(res.message || 'Wishlist cleared successfully')
    } else {
      toast.error(res?.message || 'Something went wrong clearing the wishlist. Please try again.')
    }
  }

  return (
    <button
      onClick={handleClearWishlist}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 p-2 text-start transition-colors hover:bg-gray-300/10',
        !currentWishlist?.is_default && 'border-gray-200/80 border-b',
      )}>
      <HeartMinus size={15} color="#3866DF" />
      Empty Wishlist
    </button>
  )
}
