import { useLocation, useNavigate } from "@tanstack/react-router";
import { memo } from "react";
import { ChartColumnBig, Package, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";

export const SidebarLinks = memo(() => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const normalizedPath = pathname.replace(/\/+$/, "");

    return (
        <section className="p-[8px] flex flex-col items-start gap-[4px] rounded-[12px] bg-white">
            <h3 className="text-[12px] uppercase font-bold text-[#6a6a6a] ml-3 mb-2">
                Menu
            </h3>
            <ul className="w-full ml-3 space-y-4">
                <li className="w-full">
                    <button
                        onClick={() => navigate({ to: "/dashboard" })}
                        className={cn(
                            "flex items-center h-[48px] w-full p-[0_8px] space-x-[10px] rounded-[8px] transition-colors cursor-pointer",
                            normalizedPath === "/dashboard"
                                ? "font-bold bg-[#fffcd1] text-[#544e03]"
                                : "hover:bg-[#f2f2f2cc]"
                        )}
                    >
                        <ChartColumnBig size={22} />
                        <span>Dashboard</span>
                    </button>
                </li>
                <li className="w-full">
                    <button
                        onClick={() => navigate({ to: "/dashboard/products" })}
                        className={cn(
                            "flex items-center h-[48px] w-full p-[0_8px] space-x-[10px] rounded-[8px] transition-colors cursor-pointer",
                            normalizedPath.startsWith("/dashboard/products")
                                ? "font-bold bg-[#fffcd1] text-[#544e03]"
                                : "hover:bg-[#f2f2f2cc]"
                        )}
                    >
                        <Package size={22} />
                        <span>Products</span>
                    </button>
                </li>
                <li className="w-full">
                    <button
                        onClick={() => navigate({ to: "/dashboard/orders" })}
                        className={cn(
                            "flex items-center h-[48px] w-full p-[0_8px] space-x-[10px] rounded-[8px] transition-colors cursor-pointer",
                            normalizedPath.startsWith("/dashboard/orders")
                                ? "font-bold bg-[#fffcd1] text-[#544e03]"
                                : "hover:bg-[#f2f2f2cc]"
                        )}
                    >
                        <ShoppingBag size={22} />
                        <span>Orders</span>
                    </button>
                </li>
            </ul>
        </section>
    );
});
