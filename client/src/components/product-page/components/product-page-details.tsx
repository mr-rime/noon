import { Link } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { Separator } from "../../ui/separator";
import { product_page_icon } from "../constants/icons";

export function ProductPageDetails() {
	return (
		<div className="w-full max-w-[312px] border border-[#eceef4] rounded-[8px] ">
			<div className="flex flex-col items-start justify-start space-x-4 py-3 px-4">
				<div className="flex items-center justify-start space-x-4 py-3 px-4">
					<img src="/media/imgs/logo-eg.png" alt="logo" className="w-[40px] h-[40px] rounded-[8px]" />
					<div>
						<Link to={"/seller/$sellerId"} params={{ sellerId: "1" }}>
							<div className="flex items-center cursor-pointer text-[14px] hover:text-[#3866DF] transition-colors">
								Sold by <strong className="ml-1">noon</strong> <ChevronRight size={20} />
							</div>
						</Link>
						<div className="flex items-center justify-start space-x-1">
							<Star fill="#008000" color="#008000" size={16} />{" "}
							<span className="text-[14px] text-[#008000] font-bold">4.3</span>
						</div>
					</div>
				</div>

				<div className="grid gap-[8px] grid-cols-2 cursor-pointer w-full">
					<div className="bg-[#f3f4f8] h-[32px] w-full rounded-[6px] gap-[6px] grid-cols-[span_2/span_2] flex items-center justify-center px-[8px] py-[4px] text-[14px] flex-row flex-nowrap">
						<span className="text-ellipsis whitespace-nowrap text-[#404553]">Item as shown</span>
						<span className="text-[#38AE04] whitespace-nowrap break-keep text-ellipsis font-bold">90%</span>
					</div>
					<div className="bg-[#f3f4f8] h-[32px] rounded-[6px] gap-[6px] grid-cols-[span_2/span_2] flex items-center justify-center px-[8px] py-[4px] text-[14px]">
						<span className="text-ellipsis whitespace-nowrap text-[#404553]">Partner since</span>
						<span className="text-[#38AE04] whitespace-nowrap break-keep text-ellipsis font-bold">4+ Y</span>
					</div>

					<div className="bg-[#f3f4f8] h-[32px] rounded-[6px] gap-[6px] grid-cols-[span_2/span_2] flex items-center justify-center px-[8px] py-[4px] text-[14px]">
						<span className="text-ellipsis whitespace-nowrap text-[#404553]">Great recent rating</span>
					</div>
				</div>
			</div>
			<Separator className="my-5" />
			{/* Name of this section is Support Details */}
			<div className="py-3 px-4">
				<ul className="space-y-3">
					<li className="flex items-center space-x-2 text-[14px] text-[#7F7F7F] hover:text-[#3866DF] cursor-pointer ">
						<div>{product_page_icon.lockerDeliveryIcon}</div>

						<span>Free delivery on Lockers</span>
					</li>

					<li className="flex items-center space-x-2 text-[14px]  text-[#7F7F7F] hover:text-[#3866DF]  cursor-pointer ">
						<div>{product_page_icon.returnableIcon}</div>
						<span>This item is eligible for fre returns</span>
					</li>

					<li className="flex items-center space-x-2 text-[14px] text-[#7F7F7F] hover:text-[#3866DF] cursor-pointer ">
						<div>{product_page_icon.securePaymentsIcon}</div>
						<span>Secure Payments</span>
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
	);
}
