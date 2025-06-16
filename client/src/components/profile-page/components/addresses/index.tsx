import { Button } from "../../../ui/button";
import { Address } from "./components/address";

export function Addresses() {
    return (
        <section className="h-screen">
            <h1 className="font-bold text-[28px]">
                Addresses
            </h1>
            <p className="text-[#7e859b] text-[1rem]">
                Manage your saved addresses for fast and easy checkout across our marketplaces
            </p>
            <Button className="mt-5">Add new Address</Button>

            <div>
                <h2 className="mt-[25px] mb-[16px] text-[19px] font-bold">
                    Default address
                </h2>
            </div>

            <div>
                <Address />
            </div>

            <div>
                <h2 className="mt-[25px] mb-[16px] text-[19px] font-bold">
                    Other addresses
                </h2>
            </div>
        </section>
    )
}
