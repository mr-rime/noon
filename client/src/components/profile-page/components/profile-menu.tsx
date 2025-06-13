import { useLocation, useNavigate } from "@tanstack/react-router";
import { profile_page_icons } from "../constants/icons";
import { cn } from "../../../utils/cn";
import { matchesExpectedRoute } from "../../../utils/matchesExpectedRoute";

export function ProfileMenu() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <section className="p-[8px] flex flex-col items-start gap-[4px] rounded-[12px] bg-white">
            <ul className="w-full space-y-1.5">
                <li className="w-full">
                    <button onClick={() => navigate({ to: "/orders" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[16px] rounded-[8px] transition-colors cursor-pointer", (pathname === "/orders" || matchesExpectedRoute(pathname, ['/orders/track/order/:orderId'])) && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        {profile_page_icons.bookIcon}
                        <span>
                            Orders
                        </span>
                    </button>
                </li>
                <li>
                    <button onClick={() => navigate({ to: "/returns" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[16px] rounded-[8px] transition-colors cursor-pointer", pathname === "/returns" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        {profile_page_icons.eyeArrowIcon}
                        <span>
                            Returns
                        </span>
                    </button>
                </li>

            </ul>
        </section>
    )
}
