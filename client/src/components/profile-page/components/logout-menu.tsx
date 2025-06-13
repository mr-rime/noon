import { useMutation } from "@apollo/client";
import { cn } from "../../../utils/cn";
import { LOGOUT } from "../../../graphql/auth";
import { toast } from "sonner";
import client from "../../../apollo";
import { GET_USER } from "../../../graphql/user";
import Cookies from "js-cookie";
import { profile_page_icons } from "../constants/icons";

export function LogoutMenu() {
    const [logout,] = useMutation(LOGOUT)
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
        <section className="p-[8px] flex flex-col items-start gap-[4px] rounded-[12px] bg-white">
            <h3 className="text-[12px] uppercase font-bold text-[#6a6a6a] ml-3 mb-2">
                Others
            </h3>
            <ul className="w-full">
                <li className="w-full">
                    <button onClick={handleLogout} className={cn("flex items-center hover:bg-[#ff000014] rounded-[8px] transition-colors h-[48px] w-full p-[0_8px] space-x-[16px] cursor-pointer")}>
                        {profile_page_icons.signoutIcon}
                        <span>
                            Sign out
                        </span>
                    </button>
                </li>
            </ul>
        </section>
    )
}
