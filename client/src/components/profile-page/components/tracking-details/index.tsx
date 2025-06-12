import { useNavigate } from "@tanstack/react-router"
import { OrderTimeline } from "./components/order-timeline";


export function TrackingDetails() {
    const navigate = useNavigate();
    return (
        <section className="w-full max-w-[655px]">
            <button onClick={() => navigate({ to: "/orders" })} className="text-[14px] text-[#7e859b] cursor-pointer hover:underline">
                Back to orders
            </button>
            <h1 className="font-bold text-[28px]">
                Tracking details

            </h1>
            <p className="text-[#7e859b] text-[1rem]">
                View and update delivery information for your item
            </p>

            <OrderTimeline />
        </section>
    )
}
