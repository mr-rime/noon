import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { GET_WISHLISTS, UPDATE_WISHLIST } from '@/graphql/wishlist'
import { useModalDialog } from '@/hooks'
import { useMutation } from '@apollo/client'
import { Pencil } from 'lucide-react'
import type { WishlistResponse, WishlistType } from '../types'
import { toast } from 'sonner'
import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { useState } from 'react'

export function EditButttonWithModal({ wishlist }: { wishlist: WishlistType | undefined }) {
  const [wishlistName, setWishlistName] = useState('')
  const [updateWishlist, { loading }] = useMutation<WishlistResponse<'updateWishlist', null>>(UPDATE_WISHLIST, {
    refetchQueries: [GET_WISHLISTS],
    awaitRefetchQueries: true,
  })
  const { close, open, isOpen } = useModalDialog()

  const trimmedWishlistName = wishlistName.trim()

  const handleUpdateWishlist = async () => {
    if (trimmedWishlistName === '') return toast.error('Wishlist name cannot be empty')
    const { data } = await updateWishlist({
      variables: {
        name: wishlistName || wishlist?.name,
        is_private: wishlist?.is_private,
        is_default: wishlist?.is_default,
        wishlist_id: wishlist?.id,
      },
    })
    const res = data?.updateWishlist

    if (res?.success) {
      toast.success(res.message)
      close()
    } else {
      toast.error(res?.message)
    }
  }

  return (
    <>
      <button
        onClick={open}
        className="flex w-full cursor-pointer items-center gap-2 border-gray-200/80 border-b p-2 text-start transition-colors hover:bg-gray-300/10">
        <Pencil size={15} color="#3866DF" />
        Edit
      </button>

      {isOpen && (
        <ModalDialog
          className="h-fitt w-[500px] p-[20px]"
          onClose={close}
          header={
            <>
              <h3 className="font-bold text-[22px]">Edit Wishlist</h3>
              <Separator className="my-3" />
            </>
          }
          content={
            <div className="my-4">
              <Input
                onChange={(e) => setWishlistName(e.target.value)}
                placeholder="Enter  wishlist name..."
                className="w-full"
                input={{ className: 'focus:border-[#9ba0b1]' }}
                value={wishlistName}
              />
            </div>
          }
          footer={
            <div className="mt-24">
              {loading ? (
                <Button className="relative h-[40px] w-full disabled:cursor-default ">
                  <BouncingLoading />
                </Button>
              ) : trimmedWishlistName === '' ? (
                <Button disabled className="relative h-[40px] w-full opacity-80 disabled:cursor-not-allowed ">
                  Edit
                </Button>
              ) : (
                <Button onClick={handleUpdateWishlist} className="relative h-[40px] w-full disabled:cursor-default ">
                  Edit
                </Button>
              )}
            </div>
          }
        />
      )}
    </>
  )
}
