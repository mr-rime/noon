import { SellerPicture } from "./components/seller-picture";
import { SellerBanner } from "./components/seller-banner";
import { SellerInformation } from "./components/seller-information";
import { SellerRatings } from "./components/seller-ratings";
import { Separator } from "../ui/separator";

export function SellerPage() {
    return (
        <main className="site-container ">
            <SellerBanner />
            <section className="bg-white flex items-start">
                <section className="relative w-[520px] p-[55px_36px_16px]">
                    <SellerPicture />
                    <SellerInformation />
                </section>
                <Separator className="w-[1px] h-[1000px] mx-4" />
                <SellerRatings />
            </section>
        </main>
    )
}
