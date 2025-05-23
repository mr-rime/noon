import { LoginButtonWithModalDialog } from "./login-button-with-modal-dialog";
import { Search } from "./search";



export function Header() {
    return (
        <header className="bg-[#FEEE00] h-[64px] w-full flex items-center justify-center">
            <div className="flex items-center justify-center w-[70%] mx-auto">
                <div className="text-[25px]">
                    noon
                </div>
                <Search />
                <LoginButtonWithModalDialog />
                <div className="text-[25px]">
                    noon
                </div>
            </div>
        </header>
    )
}