import { useMemo, useRef } from 'react'
import { InfiniteScrollingImage } from '@/shared/components/ui/infinite-scrolling-image'
import { ModalDialog } from '@/shared/components/ui/modal-dialog/modal-dialog'
import { FormSwitch } from './components/form-switch'
import type { LoginModalProps } from '@/shared/types/auth'

export function LoginModal({ onClose }: LoginModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)



  const memoizedFormSwitch = useMemo(() => <FormSwitch inputRef={inputRef} onClose={onClose} />, [])
  return (
    <ModalDialog
      contentClassName="p-3"
      closeButtonClassName="bg-white"
      onClose={onClose}
      header={
        <>
          <InfiniteScrollingImage imageUrl="/media/imgs/random-items.png" />
          <h2 id="login-dialog-title" className="mb-4 text-center font-bold text-xl">
            Hello! Let's get started
          </h2>
        </>
      }
      content={memoizedFormSwitch}
    />
  )
}
