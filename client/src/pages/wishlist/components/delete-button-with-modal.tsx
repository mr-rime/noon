import { Button } from '@/components/ui/button'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { GET_HOME } from '@/graphql/home'
import { DELETE_WISHLIST, GET_WISHLIST_ITEMS, GET_WISHLISTS } from '@/graphql/wishlist'
import { useModalDialog } from '@/hooks'
import { useMutation } from '@apollo/client'
import { Trash } from 'lucide-react'
import type { WishlistResponse, WishlistType } from '../types'
import { toast } from 'sonner'
import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { useNavigate } from '@tanstack/react-router'

export function DeleteButtonWithModal({
  currentWishlist,
  wishlists,
}: {
  currentWishlist: WishlistType | undefined
  wishlists: WishlistType[]
}) {
  const [deleteWishlist, { loading }] = useMutation<WishlistResponse<'deleteWishlist', WishlistType>>(DELETE_WISHLIST, {
    refetchQueries: [GET_WISHLISTS, GET_HOME, GET_WISHLIST_ITEMS],
    awaitRefetchQueries: true,
  })
  const { close, open, isOpen } = useModalDialog()
  const navigate = useNavigate()

  const handleDeleteWishlist = async () => {
    const { data } = await deleteWishlist({ variables: { wishlist_id: currentWishlist?.id } })
    const res = data?.deleteWishlist
    if (res?.success) {
      toast.success(res.message || 'Wishlist deleted successfully')
      navigate({ to: '/wishlist', search: { wishlistCode: wishlists[0].id } })
      close()
    } else {
      toast.error(res?.message || 'Something went wrong deleting the wishlist. Please try again.')
    }
  }
  return (
    <>
      <button
        onClick={open}
        className="flex w-full cursor-pointer items-center gap-2 p-2 text-start text-[#FB2020] transition-colors hover:bg-gray-300/10">
        <Trash size={15} color="#FB2020" />
        Delete
      </button>

      {isOpen && (
        <ModalDialog
          className="h-fitt w-[500px] p-[20px]"
          onClose={close}
          header={
            <div className="w-full text-center">
              <h3 className="font-bold text-[22px]">Delete Wishlist</h3>
              <Separator className="my-3" />
            </div>
          }
          content={<div className="my-1 text-center">Are you sure you want to delete this wishlist?</div>}
          footer={
            <div className="mt-24 flex items-center gap-2">
              <Button
                onClick={close}
                className="relative h-[40px] w-full flex-1 basis-1/2 border-1 border-[#374151] bg-transparent text-[#374151] hover:bg-transparent disabled:cursor-default ">
                No
              </Button>
              {loading ? (
                <Button className="relative h-[40px] w-full flex-1 basis-1/2 disabled:cursor-default ">
                  <BouncingLoading />
                </Button>
              ) : (
                <Button
                  onClick={handleDeleteWishlist}
                  className="relative h-[40px] w-full flex-1 basis-1/2 disabled:cursor-default ">
                  Yes
                </Button>
              )}
            </div>
          }
        />
      )}
    </>
  )
}
