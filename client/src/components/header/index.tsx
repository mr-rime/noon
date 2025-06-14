import { LoginButtonWithModalDialog } from "../ui/modal-dialog/login-button-with-modal-dialog";
import { SearchInput } from "./components/search";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../graphql/user";
import Cookies from 'js-cookie';
import { UserMenu } from "./components/user-menu";
import { header_icons } from "./constants/icons";
import { Separator } from "../ui/separator";
import { matchesExpectedRoute } from "../../utils/matchesExpectedRoute";

const expectedRoutes = [
    '/orders',
    '/returns',
    '/profile',
    '/addresses',
    '/payments',
    '/security-settings',
    '/orders/track/order/:orderId'
]

export function Header() {
    const { data } = useQuery(GET_USER, { variables: { hash: Cookies.get('hash') } })
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const user = data?.user.user?.[0];

    return (
        <header className="bg-[#FEEE00] h-[64px] w-full flex items-center justify-center">

            <div className="flex items-center justify-center w-[70%]  site-container">
                <Link to="/" className="text-[25px]">
                    noon
                </Link>
                <SearchInput />
                {
                    matchesExpectedRoute(pathname, expectedRoutes) ? <button className="cursor-pointer" onClick={() => navigate({ to: "/" })}>
                        {header_icons.homeIcon}
                    </button> : !user ? <LoginButtonWithModalDialog /> : <UserMenu user={user} />
                }

                <Separator className=" w-[1px] h-[20px] mx-3 bg-[#404553] opacity-[0.2]" />

                {

                    !matchesExpectedRoute(pathname, expectedRoutes) && <><Link to={'/'} className="mx-3">
                        {user ? <div>
                            {header_icons.heartIcon}
                        </div> : <LoginButtonWithModalDialog>
                            {({ open, isOpen }) => (
                                <div onClick={open} aria-expanded={isOpen}>
                                    {header_icons.heartIcon}
                                </div>
                            )}
                        </LoginButtonWithModalDialog>}
                    </Link>
                    </>

                }

                <Link to={'/cart'} className="mx-1">
                    {header_icons.cartIcon}
                </Link>

            </div>

        </header >
    )
}