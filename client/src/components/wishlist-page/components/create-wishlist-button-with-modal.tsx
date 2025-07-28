import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { useModalDialog } from '@/hooks/use-modal-dialog'
import { useState } from 'react'

export function CreateWishlistButtonWithModal() {
  const { isOpen, open, close } = useModalDialog()
  const [isUsingDefualt, setIsUsingDefualt] = useState(false)
  return (
    <div>
      <Button onClick={open} className="h-[40px] px-[20px] py-[10px]">
        Create new wishlist
      </Button>

      {isOpen && (
        <ModalDialog
          className="h-[350px] w-[500px] p-[20px]"
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
                disabled
                className="h-[40px] w-full disabled:cursor-default disabled:bg-[#f0f1f4] disabled:text-[#cbcfd7]">
                Create
              </Button>
            </div>
          }
        />
      )}
    </div>
  )
}
