import { LoginButtonWithModalDialog } from "../ui/modal-dialog/login-button-with-modal-dialog";
import { Search } from "../search";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/user";
import Cookies from 'js-cookie';
import { UserMenu } from "./components/user-menu";


export function Header() {
    const { data } = useQuery(GET_USER, { variables: { hash: Cookies.get('hash') } })
    const user = data?.user.user?.[0];

    return (
        <header className="bg-[#FEEE00] h-[64px] w-full flex items-center justify-center">
        
            <div className="flex items-center justify-center w-[70%] mx-auto">
                <div className="text-[25px]">
                    noon
                </div>
                <Search />
                {
                    !user ? <LoginButtonWithModalDialog /> : <UserMenu user={user} />
                }

                <Link to={'/'} className="mx-3">
                    <Heart size={20} />
                </Link>
                <Link to={'/cart'} className="mx-3">
                    <ShoppingCart size={20} />
                </Link>

            </div>

        </header >
    )
}