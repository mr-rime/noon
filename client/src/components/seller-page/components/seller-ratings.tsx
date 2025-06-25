import { Star } from "lucide-react";
import { Button } from "../../ui/button";
import { RatingsBar } from "../../ui/ratings-bar";
import { Separator } from "../../ui/separator";
import { SellerReview } from "./seller-review";

export function SellerRatings() {
	return (
		<section className="p-[36px_36px_16px] bg-white flex-auto max-w-[50%]">
			<div className="text-[1.4rem] font-bold">Seller Ratings & Reviews</div>
			<div className="flex items-center w-full gap-[10px_20px] mt-5">
				<div>
					<div className="text-[32px] font-bold">
						<span>4.3</span>
					</div>
					<div className="my-1 flex items-center gap-1">
						<Star fill="#80AE04" color="#80AE04" size={25} />
						<Star fill="#80AE04" color="#80AE04" size={25} />
						<Star fill="#80AE04" color="#80AE04" size={25} />
						<Star fill="#80AE04" color="#80AE04" size={25} />
						<Star fill="#80AE04" color="#80AE04" size={25} />
					</div>
					<div className="text-[#7e859b]">
						<span>Based on 169299 ratings</span>
					</div>
				</div>
				<div className="w-full max-w-[300px]">
					<RatingsBar />
				</div>
			</div>
			<div className="mt-[17px]">
				<Separator className="my-2" />
				<div className="text-[#9ba0b1] text-[14px]">There are 169299 ratings and 79576 reviews for this seller</div>
				<Separator className="my-2" />
			</div>

			<div className="flex flex-col items-start">
				<SellerReview />
				<SellerReview />
				<SellerReview />
				<Button className="bg-transparent text-[#3866df] font-bold text-[12px] border border-[#3866df] h-[32px] px-[16px] rounded-[4px] hover:bg-transparent hover:opacity-[.8] mt-5">
					View All Reviews
				</Button>
			</div>
		</section>
	);
}
