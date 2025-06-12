import { useLocation, useNavigate } from "@tanstack/react-router";
import { profile_page_icons } from "../constants/icons";
import { cn } from "../../../utils/cn";

export function ProfileMenu() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <section className="p-[8px] flex flex-col items-start gap-[4px] rounded-[12px] bg-white">
            <ul className="w-full">
                <li className="w-full">
                    <button onClick={() => navigate({ to: "/orders" })} className={cn("flex items-center h-[48px] w-full p-[0_8px] space-x-[16px] cursor-pointer", pathname === "/orders" && "font-bold bg-[#fffcd1] rounded-[8px]")}>
                        {profile_page_icons.bookIcon}
                        <span>
                            Orders
                        </span>
                    </button>
                </li>
                <li>
                    <button onClick={() => navigate({ to: "/returns" })} className={cn("flex items-center h-[48px] w-full p-[0_8px] space-x-[16px] cursor-pointer", pathname === "/returns" && "font-bold bg-[#fffcd1] rounded-[8px]")}>
                        {profile_page_icons.eyeArrowIcon}
                        <span>
                            Returns
                        </span>
                    </button>
                </li>
                <li></li>
            </ul>
        </section>
    )
}
