import { useNavigate } from "@tanstack/react-router";
import { seller_page_icons } from "../constants/icons";
import { Separator } from "../../ui/separator";
import { Star } from "lucide-react";
import { Progress } from "../../ui/progress";

export function SellerInformation() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-start">
            <div>
                <button onClick={() => navigate({ to: "." })} className="text-[#3866df] underline text-[22px] text-start font-bold cursor-pointer">noon</button>
            </div>

            <div className="flex items-center space-x-2 mt-3">
                {seller_page_icons.callIcon}
                <a href="tel:+200216358" className="text-[14px]">+200216358</a>
            </div>

            <Separator className="my-5" />

            <div className="flex items-center space-x-[8px] w-full">
                <div className="bg-white rounded-[8px] w-1/2 relative border border-[#ebecf0] p-[16px]">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-[16px] text-start">
                            Seller Rating
                        </div>
                        <div className="gray-filter cursor-pointer">
                            {seller_page_icons.helpIcon}
                        </div>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-1">
                        <span className="text-[1.8rem] font-bold">4.3</span>
                        <Star color="#80AE04" fill="#80AE04" size={19} />
                    </div>
                    <div>
                        <span className="text-[#404553] font-bold text-[14px]">81%</span> <span className="text-[#9ba0b1] text-[14px]">Positive Ratings</span>
                    </div>
                </div>
                <div className="bg-white rounded-[8px] w-1/2 relative border border-[#ebecf0] p-[16px]">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-[16px] text-start">
                            Customers
                        </div>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-1">
                        <span className="text-[1.8rem] font-bold">308K+</span>
                    </div>
                    <div>
                        <span className="text-[#9ba0b1] text-[14px]">During the last 90 days</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-start bg-white rounded-[8px] w-full mt-4 relative border border-[#ebecf0] p-[16px]">
                <div className="flex items-center space-x-1 w-1/2">
                    <div>
                        {seller_page_icons.greatSellerIcon}
                    </div>
                    <div className="text-[13px] font-bold">Great Recent Rating</div>
                    <div className="gray-filter cursor-pointer">
                        {seller_page_icons.helpIcon}
                    </div>
                </div>
                <Separator className="w-[1px] h-[100px] mx-4" />
                <div className="w-1/2 ">
                    <span className="text-[#9ba0b1] text-start text-[14px]">Noon reviews these badges every day and sellers are awarded special badges based on their performence.</span>
                </div>
            </div>

            <div className="flex flex-col items-start justify-center bg-white rounded-[8px] w-full mt-4 relative border border-[#ebecf0] p-[16px]">
                <div className="flex items-center w-full space-x-2">
                    <div className="whitespace-nowrap text-[14px]">
                        Product as Described
                    </div>

                    <div className="w-full flex items-center space-x-1">
                        <Progress progressPercentage={90} className="h-[6px] bg-[#ebecf0]" />
                        <div className="text-[#38AE04] font-bold text-[14px]">
                            90%
                        </div>
                    </div>
                </div>
                <div className="mt-5 w-full flex items-center justify-between">
                    <div className="text-[#7e859b]">
                        What do these mean?
                    </div>
                    <div className="gray-filter cursor-pointer">
                        {seller_page_icons.helpIcon}
                    </div>
                </div>
            </div>

            <Separator className="my-5" />
            <div>
                <div className="text-[#7e859b] text-[14px]">
                    Seller Since
                </div>
                <div className="text-[14px] font-bold">
                    December, 2020
                </div>
            </div>
        </div>
    )
}
