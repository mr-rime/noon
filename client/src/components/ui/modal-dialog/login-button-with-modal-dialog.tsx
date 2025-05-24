import { useModalDialog } from "../../../hooks/use-modal-dialog"
import { LoginModalDialog } from "./login-modal-dialog";


export function LoginButtonWithModalDialog() {
    const { isOpen, open, close } = useModalDialog();

    return (
        <>
            <button
                className="h-[36px] w-[100px] rounded-[7px] bg-[#c7ba00] text-white font-bold cursor-pointer"
                onClick={open}
            >
                Login
            </button>

            {
                isOpen && (
                    <LoginModalDialog onClose={close} />
                )
            }
        </>
    )
}
