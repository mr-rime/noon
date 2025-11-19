import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { CREATE_WISHLIST, GET_WISHLISTS } from '@/graphql/wishlist'
import { useModalDialog } from '@/hooks/use-modal-dialog'
import { useMutation, useQuery } from '@apollo/client'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { WishlistResponse, WishlistType } from '../types'
import { useNavigate } from '@tanstack/react-router'

export function CreateWishlistButtonWithModal() {
  const { isOpen, open, close } = useModalDialog()
  const [isUsingDefualt, setIsUsingDefualt] = useState(false)
  const [createWishlist, { loading }] = useMutation<WishlistResponse<'createWishlist', WishlistType>>(CREATE_WISHLIST, {
    refetchQueries: [GET_WISHLISTS],
    awaitRefetchQueries: true,
  })
  const wishlistNameInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()


  const { data: wishlistsData } = useQuery<WishlistResponse<'getWishlists', WishlistType[]>>(GET_WISHLISTS)
  const existingWishlists = wishlistsData?.getWishlists?.data || []
  const MAX_WISHLISTS = 4
  const isAtLimit = existingWishlists.length >= MAX_WISHLISTS

  const handleCreateWishlist = async () => {
    if (wishlistNameInputRef.current?.value.trim() === '') return toast.error('Wishlist name cannot be empty')


    if (existingWishlists.length >= MAX_WISHLISTS) {
      return toast.error(`You can only have ${MAX_WISHLISTS} wishlists. Please delete an existing wishlist to create a new one.`)
    }

    const { data } = await createWishlist({ variables: { name: String(wishlistNameInputRef.current?.value) } })
    const res = data?.createWishlist
    if (res?.success) {
      toast.success(res?.message || 'Wishlist created successfully')
      navigate({ to: '/wishlist', search: { wishlistCode: res.data.id } })
      close()
    } else {
      toast.error(res?.message || 'An error occurred while creating the wishlist')
    }
  }

  const handleOpenModal = () => {
    if (isAtLimit) {
      toast.error(`You can only have ${MAX_WISHLISTS} wishlists. Please delete an existing wishlist to create a new one.`)
      return
    }
    open()
  }

  return (
    <div>
      <Button
        onClick={handleOpenModal}
        className="h-[40px] px-[20px] py-[10px]"
        disabled={isAtLimit}
      >
        Create new wishlist {isAtLimit && `(${existingWishlists.length}/${MAX_WISHLISTS})`}
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
                input={{ className: 'focus:border-[#6B7280]' }}
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
