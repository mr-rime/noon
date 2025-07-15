import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";

export function OrderSummary() {
	return (
		<section className="border border-[rgba(198,204,221,.5)] rounded-[6px] rounded-t-none p-[10px_20px] sticky w-full max-w-[35%]">
			<h2 className="text-[19px] font-bold">Order Summary</h2>
			<Input placeholder="Coupon Code" className="mt-2" input={{ className: "bg-white" }} />
			<div className="w-full mt-5 space-y-3">
				<div className="flex items-center justify-between w-full  ">
					<div className="text-[#7e859b] text-[14px] ">Subtotal (2 items)</div>
					<div className="text-[15px]">
						<span className="mr-1">EGP</span>
						<span>75555.00</span>
					</div>
				</div>
				<div className="flex items-center justify-between w-full  ">
					<div className="text-[#7e859b] text-[14px]">Shipping Fee</div>
					<div className="text-[15px] text-[#38ae04] uppercase font-bold">
						<span>Free</span>
					</div>
				</div>
			</div>
			<Separator className="my-5 bg-[#DFDFDF]" />
			<div>
				<div className="flex items-center justify-between w-full  ">
					<div className="text-[14px] ">
						<span className="text-[20px] font-bold">Total</span>{" "}
						<span className="text-[#7e859b] ">(Inclusive of VAT)</span>
					</div>
					<div className="text-[21px] font-bold">
						<span className="mr-1">EGP</span>
						<span>75315.00</span>
					</div>
				</div>

				<div className="mt-5">
					<button className="text-white bg-[#3866df] hover:bg-[#3e72f7] transition-colors cursor-pointer w-full h-[48px] text-[14px] font-bold uppercase p-[16px] rounded-[4px]">
						Checkout
					</button>
				</div>
			</div>
		</section>
	);
}
