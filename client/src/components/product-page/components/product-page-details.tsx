import { ChevronRight, Container, Redo2, ShieldCheck, Star } from "lucide-react";
import { Separator } from "../../ui/separator";


export function ProductPageDetails() {
    return (
        <div className="w-full max-w-[312px] border border-[#eceef4] rounded-[8px] ">
            <div className="flex items-center justify-start space-x-4 py-3 px-4">
                <img src="/media/imgs/logo-eg.png" alt="logo" className="w-[40px] h-[40px] rounded-[8px]" />
                <div>
                    <div className="flex items-center cursor-pointer text-[14px] hover:text-[#3866DF] transition-colors">
                        Sold by <strong className="ml-1">noon</strong> <ChevronRight size={20} />
                    </div>
                    <div className="flex items-center justify-start space-x-1">
                        <Star fill="#008000" color="#008000" size={16} /> <span className="text-[14px] text-[#008000] font-bold">4.3</span>
                    </div>
                </div>
            </div>
            <Separator className="my-5" />
            {/* Name of this section is Support Details */}
            <div className="py-3 px-4">
                <ul className="space-y-3">
                    <li className="flex items-center space-x-2 text-[14px] text-black hover:text-[#3866DF] cursor-pointer ">
                        <Container size={20} color="#7F7F7F" /> <span>Free delivery on Lockers</span>
                    </li>

                    <li className="flex items-center space-x-2 text-[14px] text-black hover:text-[#3866DF] cursor-pointer ">
                        <Redo2 size={20} color="#7F7F7F" /> <span>This item is eligible for fre returns</span>
                    </li>

                    <li className="flex items-center space-x-2 text-[14px] text-black hover:text-[#3866DF] cursor-pointer ">
                        <ShieldCheck size={20} color="#7F7F7F" /> <span>Secure Payments</span>
                    </li>
                </ul>
            </div>

            <Separator className="my-5" />

            <div className="py-3 px-4">
                <button className="bg-[#2B4CD7] hover:bg-[#6079E1] transition-colors text-white w-full h-[48px] rounded-[14px] cursor-pointer uppercase font-bold text-[14px]">
                    Add to cart
                </button>
            </div>
        </div>
    )
}
