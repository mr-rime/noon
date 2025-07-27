import { UserRound } from 'lucide-react'
import { useModalDialog } from '../../../hooks/use-modal-dialog'
import { LoginModal } from '..'

type LoginButtonWithModalDialogProps = {
  children?: (props: { open: () => void; isOpen: boolean }) => React.ReactNode
}

export function LoginButtonWithModalDialog({ children }: LoginButtonWithModalDialogProps) {
  const { isOpen, open, close } = useModalDialog()

  return (
    <>
      {!children && (
        <button
          className="flex h-[36px] w-[100px] cursor-pointer items-center justify-center space-x-1 rounded-[7px] font-medium transition-colors hover:text-[#8C8832]"
          onClick={open}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="login-modal">
          <span>Log in</span> <UserRound size={16} />
        </button>
      )}

      {children && children({ open, isOpen })}

      {isOpen && <LoginModal onClose={close} />}
    </>
  )
}
