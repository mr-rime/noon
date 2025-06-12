import { useLocation, useNavigate } from "@tanstack/react-router";
import { cn } from "../../../utils/cn";
import { profile_page_icons } from "../constants/icons";

export function MyAccountMenu() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <section className="p-[8px] flex flex-col items-start gap-[4px] rounded-[12px] bg-white">
            <h3 className="text-[12px] uppercase font-bold text-[#6a6a6a] ml-3 mb-2">
                My Account
            </h3>
            <ul className="w-full">
                <li className="w-full">
                    <button onClick={() => navigate({ to: "/profile" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[16px] rounded-[8px] transition-colors cursor-pointer", pathname === "/profile" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        {profile_page_icons.profileIcon}
                        <span>
                            Profile
                        </span>
                    </button>
                </li>
                <li>
                    <button onClick={() => navigate({ to: "/addresses" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[16px] rounded-[8px] transition-colors cursor-pointer", pathname === "/addresses" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        {profile_page_icons.locationIcon}
                        <span>
                            Addresses
                        </span>
                    </button>
                </li>
                <li>
                    <button onClick={() => navigate({ to: "/payments" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[16px] rounded-[8px] transition-colors cursor-pointer", pathname === "/payments" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        {profile_page_icons.stackIcon}
                        <span>
                            Payments
                        </span>
                    </button>
                </li>

                <li>
                    <button onClick={() => navigate({ to: "/security-settings" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[16px] rounded-[8px] transition-colors cursor-pointer", pathname === "/security-settings" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        {profile_page_icons.shieldUser}
                        <span>
                            Security Settings
                        </span>
                    </button>
                </li>
            </ul>
        </section>
    )
}