import { useLocation, useNavigate } from "@tanstack/react-router";
import { memo } from "react";
import { cn } from "../../../../../../utils/cn";
import { ChartColumnBig, Package, ShoppingBag } from "lucide-react";

export const SidebarLinks = memo(() => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <section className="p-[8px] flex flex-col items-start gap-[4px] rounded-[12px] bg-white">
            <h3 className="text-[12px] uppercase font-bold text-[#6a6a6a] ml-3 mb-2">
                Menu
            </h3>
            <ul className="w-full ml-3 space-y-4">
                <li className="w-full">
                    <button onClick={() => navigate({ to: "/dashboard" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[10px] rounded-[8px] transition-colors cursor-pointer", pathname === "/dashboard" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        <ChartColumnBig size={22} className={cn(pathname === "/dashboard" && "text-[#544e03]")} />
                        <span>
                            Dashboard
                        </span>
                    </button>
                </li>
                <li className="w-full">
                    <button onClick={() => navigate({ to: "/dashboard/products" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[10px] rounded-[8px] transition-colors cursor-pointer", (pathname === "/dashboard/products" || pathname === "/dashboard/products/new") && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        <Package size={22} className={cn((pathname === "/dashboard/products" || pathname === "/dashboard/products/new") && "text-[#544e03]")} />
                        <span>
                            Products
                        </span>
                    </button>
                </li>

                <li className="w-full">
                    <button onClick={() => navigate({ to: "/dashboard/orders" })} className={cn("flex items-center h-[48px] hover:bg-[#f2f2f2cc] w-full p-[0_8px] space-x-[10px] rounded-[8px] transition-colors cursor-pointer", pathname === "/dashboard/orders" && "font-bold bg-[#fffcd1] hover:bg-[#fffcd1] ")}>
                        <ShoppingBag size={22} className={cn(pathname === "/dashboard/orders" && "text-[#544e03]")} />
                        <span>
                            Orders
                        </span>
                    </button>
                </li>
            </ul>
        </section>
    )
})