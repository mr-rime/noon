import { ChevronDown } from "lucide-react";
import { Dropdown } from "../../ui/dropdown";
import type { User } from "../../../types";
import { header_icons } from "../constants/icons";
import { cn } from "../../../utils/cn";
import { useNavigate } from "@tanstack/react-router";
import { Separator } from "../../ui/separator";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../../graphql/auth";
import client from "../../../apollo";
import { GET_USER } from "../../../graphql/user";
import Cookies from "js-cookie"
import { toast } from "sonner";
import { memo } from "react";


export const UserMenu = memo(({ user }: { user: User }) => {
    const [logout,] = useMutation(LOGOUT)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const { data } = await logout()
            await client.refetchQueries({ include: [GET_USER] })
            Cookies.remove('hash');
            toast.success(data.logout.message)
        } catch (e) {
            console.error(e)
            toast.error("Something went wrong!")
        }
    }

    return (
        <Dropdown
            align="center"
            trigger={(isOpen) => (
                <button className="flex items-center gap-1 font-bold text-[1rem] cursor-pointer">
                    <span>Hello</span>
                    <span>
                        {user.first_name}
                    </span>
                    <ChevronDown size={19} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
                </button>
            )}
        >
            <div className="w-48 py-2 bg-white">
                <button onClick={() => navigate({ to: "/orders", resetScroll: true })} className=" w-full hover:bg-[#F3F4F8] transition-colors cursor-pointer flex items-center p-[8px_25px] text-center whitespace-nowrap">
                    {header_icons.ordersIcon}
                    <span className="text-[1rem] ml-4">
                        Orders
                    </span>
                </button>
                <button onClick={() => navigate({ to: "/addresses", resetScroll: true })} className=" w-full hover:bg-[#F3F4F8] transition-colors cursor-pointer flex items-center p-[8px_25px] text-center whitespace-nowrap">
                    {header_icons.addressesIcon}
                    <span className="text-[1rem] ml-4">
                        Addresses
                    </span>
                </button>
                <button onClick={() => navigate({ to: "/payments", resetScroll: true })} className=" w-full hover:bg-[#F3F4F8] transition-colors cursor-pointer flex items-center p-[8px_25px] text-center whitespace-nowrap">
                    {header_icons.paymentsIcon}
                    <span className="text-[1rem] ml-4">
                        Payments
                    </span>
                </button>
                <button onClick={() => navigate({ to: "/returns", resetScroll: true })} className=" w-full hover:bg-[#F3F4F8] transition-colors cursor-pointer flex items-center p-[8px_25px] text-center whitespace-nowrap">
                    {header_icons.returnsIcon}
                    <span className="text-[1rem] ml-4">
                        Returns
                    </span>
                </button>
                <button onClick={() => navigate({ to: "/profile", resetScroll: true })} className=" w-full hover:bg-[#F3F4F8] transition-colors cursor-pointer flex items-center p-[8px_25px] text-center whitespace-nowrap">
                    {header_icons.profileIcon}
                    <span className="text-[1rem] ml-4">
                        Profile
                    </span>
                </button>
                <Separator className="my-2" />
                <button onClick={handleLogout} className=" w-full  flex items-center justify-center hover:bg-[#F3F4F8] transition-colors cursor-pointer p-[8px_25px] text-center whitespace-nowrap">
                    <span className="text-[1rem] text-[#7e859b] text-center ">
                        Sign Out
                    </span>
                </button>
            </div>
        </Dropdown>
    )
})
