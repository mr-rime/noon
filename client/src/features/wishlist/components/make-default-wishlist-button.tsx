import { useMutation } from '@apollo/client'
import type { WishlistResponse, WishlistType } from '../types'
import { GET_WISHLISTS, UPDATE_WISHLIST } from '@/features/wishlist/api/wishlist'
import { toast } from 'sonner'
import { CircleCheck } from 'lucide-react'

export function MakeDefaultWishlistButton({ currentWishlist }: { currentWishlist: WishlistType | undefined }) {
  const [updateWishlist, { loading: isUpdatingWishlist }] = useMutation<
    WishlistResponse<'updateWishlist', WishlistType>
  >(UPDATE_WISHLIST, {
    refetchQueries: [GET_WISHLISTS],
    awaitRefetchQueries: true,
  })

  const handleMakeDefaultWishlist = async () => {
    if (!currentWishlist) return

    const { data } = await updateWishlist({
      variables: {
        name: currentWishlist.name,
        is_private: currentWishlist.is_private,
        is_default: true,
        wishlist_id: currentWishlist.id,
      },
    })

    if (data?.updateWishlist.success) {
      toast.success(`${currentWishlist.name} is now your default wishlist`)
    } else {
      toast.error(data?.updateWishlist.message || 'Something went wrong!')
    }
  }

  return (
    <button
      disabled={isUpdatingWishlist}
      onClick={handleMakeDefaultWishlist}
      className="flex w-full cursor-pointer items-center gap-2 border-gray-200/80 border-b p-2 text-start transition-colors hover:bg-gray-300/10">
      <CircleCheck size={15} color="#3866DF" />
      Make this default wishlist
    </button>
  )
}
