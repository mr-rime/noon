import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { CREATE_WISHLIST } from '@/graphql/wishlist'
import { useModalDialog } from '@/hooks/use-modal-dialog'
import { useMutation } from '@apollo/client'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { WishlistResponse, WishlistType } from '../types'

export function CreateWishlistButtonWithModal() {
  const { isOpen, open, close } = useModalDialog()
  const [isUsingDefualt, setIsUsingDefualt] = useState(false)
  const [createWishlist, { loading }] = useMutation<WishlistResponse<'createWishlist', WishlistType>>(CREATE_WISHLIST)
  const wishlistNameInputRef = useRef<HTMLInputElement>(null)

  const handleCreateWishlist = async () => {
    if (wishlistNameInputRef.current?.value.trim() === '') return toast.error('Wishlist name cannot be empty')

    const { data } = await createWishlist({ variables: { name: wishlistNameInputRef.current?.value } })

    if (data?.createWishlist.success) {
      toast.success(data?.createWishlist.message)
      close()
    } else {
      toast.error(data?.createWishlist.message)
    }
  }

  return (
    <div>
      <Button onClick={open} className="h-[40px] px-[20px] py-[10px]">
        Create new wishlist
      </Button>

      {isOpen && (
        <ModalDialog
          className="h-fit w-[500px] p-[20px]"
          onClose={close}
          header={
            <>
              <h3 className="font-bold text-[22px]">Create New Wishlist</h3>
              <Separator className="my-3" />
            </>
          }
          content={
            <div className="my-4">
              <Input
                placeholder="Enter  wishlist name..."
                className="w-full"
                input={{ className: 'focus:border-[#9ba0b1]' }}
                ref={wishlistNameInputRef}
              />
              <div className="mt-5">
                <Checkbox
                  checked={isUsingDefualt}
                  onChange={() => setIsUsingDefualt((prev) => !prev)}
                  name="useDefault"
                  label="Use default wishlist name"
                />
              </div>
            </div>
          }
          footer={
            <div className="mt-24">
              <Button
                disabled={loading}
                onClick={handleCreateWishlist}
                className="relative h-[40px] w-full disabled:cursor-default ">
                {loading ? <BouncingLoading /> : 'Create'}
              </Button>
            </div>
          }
        />
      )}
    </div>
  )
}
