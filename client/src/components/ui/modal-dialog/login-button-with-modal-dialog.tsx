import { UserRound } from "lucide-react";
import { useModalDialog } from "../../../hooks/use-modal-dialog"
import { LoginModalDialog } from "./login-modal-dialog";


export function LoginButtonWithModalDialog() {
    const { isOpen, open, close } = useModalDialog();

    return (
        <>
            <button
                className="h-[36px] w-[100px] rounded-[7px] hover:text-[#8C8832] transition-colors font-medium cursor-pointer flex items-center justify-center space-x-1"
                onClick={open}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="login-modal"
            >
                <span>Log in</span> <UserRound size={16} />
            </button>

            {
                isOpen && (
                    <LoginModalDialog onClose={close} />
                )
            }
        </>
    )
}
