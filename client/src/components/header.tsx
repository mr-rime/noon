import { LoginButtonWithModalDialog } from "./ui/modal-dialog/login-button-with-modal-dialog";
import { Search } from "./search";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";



export function Header() {
    return (
        <header className="bg-[#FEEE00] h-[64px] w-full flex items-center justify-center">
            <div className="flex items-center justify-center w-[70%] mx-auto">
                <div className="text-[25px]">
                    noon
                </div>
                <Search />
                <LoginButtonWithModalDialog />

                <Link to={'.'} className="mx-3">
                    <ShoppingCart  size={20}/>
                </Link>
            </div>
        </header>
    )
}