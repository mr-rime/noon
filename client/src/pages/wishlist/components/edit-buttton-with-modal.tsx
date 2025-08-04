import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { useModalDialog } from '@/hooks'
import { Pencil } from 'lucide-react'

export function EditButttonWithModal() {
  const { close, open, isOpen } = useModalDialog()

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
                placeholder="Enter  wishlist name..."
                className="w-full"
                input={{ className: 'focus:border-[#9ba0b1]' }}
              />
            </div>
          }
          footer={
            <div className="mt-24">
              <Button className="relative h-[40px] w-full disabled:cursor-default ">Edit</Button>
            </div>
          }
        />
      )}
    </>
  )
}
