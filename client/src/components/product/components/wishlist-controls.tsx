import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { ADD_CART_ITEM, GET_CART_ITEMS } from '@/graphql/cart'
import { GET_WISHLIST_ITEMS, GET_WISHLISTS, REMOVE_WISHLIST_ITEM } from '@/graphql/wishlist'
import type { WishlistResponse, WishlistType } from '@/pages/wishlist'
import type { ProductType } from '@/types'
import { useMutation } from '@apollo/client'
import { useSearch } from '@tanstack/react-router'
import { Clipboard, Ellipsis, Move, Trash } from 'lucide-react'
import { toast } from 'sonner'

export function WishlistControls({ productId }: { productId: ProductType['id'] | undefined }) {
  const [addCartItem, { loading }] = useMutation(ADD_CART_ITEM, {
    refetchQueries: [GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })

  const [removeWishlistItem, {}] = useMutation<WishlistResponse<'removeWishlistItem', WishlistType>>(
    REMOVE_WISHLIST_ITEM,
    {
      refetchQueries: [
        GET_WISHLISTS,
        {
          query: GET_WISHLIST_ITEMS,
          variables: { wishlist_id: wishlistCode },
        },
      ],
      awaitRefetchQueries: true,
    },
  )

  const handleRemoveWishlistItem = async () => {
    const { data } = await removeWishlistItem({
      variables: { wishlist_id: wishlistCode, product_id: productId },
    })

    const res = data?.removeWishlistItem

    if (res?.success) {
      toast.success(res?.message || 'Product removed from wishlist successfully.')
    } else {
      toast.error(res?.message || 'Error removing product from wishlist.')
    }
  }

  return (
    <div className="mt-5 flex items-center justify-between gap-2 ">
      <Button
        disabled={loading}
        onClick={async () => {
          const { data } = await addCartItem({ variables: { product_id: productId, quantity: 1 } })
          if (data.addToCart.success) {
            toast.success('Product added to cart successfully.')
          } else {
            toast.error('Failed to add product to cart. Please try again.')
          }
        }}
        className="h-[37px] w-[80%] text-[13px]">
        {loading ? <BouncingLoading /> : 'ADD TO CART'}
      </Button>
      <Dropdown
        align="center"
        className="!w-[20%]"
        trigger={
          <button className="flex h-[37px] w-full cursor-pointer items-center justify-center rounded-[4px] border border-[#3866df] bg-transparent">
            <Ellipsis color="#3866df" size={20} />
          </button>
        }>
        <button className="flex w-full cursor-pointer items-center gap-2 border-gray-200/80 border-b p-2 text-start transition-colors hover:bg-gray-300/10">
          <Move size={15} color="#3866DF" />
          Move to another wishlist
        </button>
        <button className="flex w-full cursor-pointer items-center gap-2 border-gray-200/80 border-b p-2 text-start transition-colors hover:bg-gray-300/10">
          <Clipboard size={15} color="#3866DF" />
          Copy to another wishlist
        </button>

        <button
          onClick={handleRemoveWishlistItem}
          className="flex w-full cursor-pointer items-center gap-2 p-2 text-start text-[#FB2020] transition-colors hover:bg-gray-300/10">
          <Trash size={15} color="#FB2020" />
          Delete
        </button>
      </Dropdown>
    </div>
  )
}
