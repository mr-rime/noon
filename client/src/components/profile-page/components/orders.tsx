import { Search } from "lucide-react";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { Order } from "./order";

export function Orders() {
    return (
        <section className="w-full">
            <div className="w-full">
                <h1 className="font-bold text-[28px]">
                    Orders
                </h1>
                <p className="text-[#7e859b] text-[1rem]">
                    View the delivery status for items and your order history
                </p>
            </div>

            <div className="mt-5 flex items-center justify-between w-full">
                <h3 className="text-[19px] font-bold">
                    Completed
                </h3>

                <div className="flex items-center gap-2">
                    <Input type="search" name="finditems" className="w-[360px]  " input={{ className: "focus:border-[#3866DF] min-h-[48px] rounded-[5px] bg-white hover:border-[#9BA0B1] transition-colors" }} icon={<Search color="#9BA0B2" size={18} />} placeholder="Find items" iconDirection="left" />
                    <Select onChange={(v) => {
                        console.log(v)
                    }} options={[
                        { label: "Last 3 months", value: "last_3_months" },
                        { label: "Last 6 months", value: "last_6_months" },
                        { label: "2025", value: "2025" },
                    ]} className="rounded-[5px] text-[16px] w-[170px] min-h-[48px] px-5 hover:border-[#9BA0B1] transition-colors" />
                </div>
            </div>

            <div className="flex flex-col mt-5">
                <Order />
            </div>
        </section>
    )
}
