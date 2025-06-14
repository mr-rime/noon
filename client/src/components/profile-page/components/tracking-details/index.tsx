import { useNavigate } from "@tanstack/react-router"
import { OrderTimeline } from "./components/order-timeline";
import { ArrowLeft } from "lucide-react";
import { OrderInvoice } from "./components/order-invoice";
import { ItemSummary } from "./components/item-summary";


export function TrackingDetails() {
    const navigate = useNavigate();
    return (
        <section className="w-full ">
            <button onClick={() => navigate({ to: "/orders" })} className="text-[14px] text-[#7e859b] cursor-pointer hover:underline flex items-center space-x-1">
                <ArrowLeft size={18} color="#7e859b" />
                <span>Back to orders</span>
            </button>
            <h1 className="font-bold text-[28px]">
                Tracking details

            </h1>
            <p className="text-[#7e859b] text-[1rem]">
                View and update delivery information for your item
            </p>

            <section className="flex items-start w-full space-x-5">
                <section className="w-full">
                    <OrderTimeline />
                    <ItemSummary />
                </section>
                <OrderInvoice />
            </section>
        </section>
    )
}
