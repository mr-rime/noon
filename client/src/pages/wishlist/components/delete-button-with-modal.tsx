import { Button } from '@/components/ui/button'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { useModalDialog } from '@/hooks'
import { Trash } from 'lucide-react'

export function DeleteButtonWithModal() {
  const { close, open, isOpen } = useModalDialog()

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
                className="relative h-[40px] w-full flex-1 basis-1/2 border-1 border-[#7e859b] bg-transparent text-[#7e859b] hover:bg-transparent disabled:cursor-default ">
                No
              </Button>
              <Button className="relative h-[40px] w-full flex-1 basis-1/2 disabled:cursor-default ">Yes</Button>
            </div>
          }
        />
      )}
    </>
  )
}
