import { Star } from "lucide-react";

export function ProductPageRates({ theme = "desktop" }: { theme?: "desktop" | "mobile" }) {
	return theme === "desktop" ? (
		<div className="flex items-center space-x-2 mt-2">
			<div className="font-semibold text-[14px]">4.6</div>

			<div className="flex items-center space-x-0.5">
				<Star fill="#008000" color="#008000" size={20} />
				<Star fill="#008000" color="#008000" size={20} />
				<Star fill="#008000" color="#008000" size={20} />
				<Star fill="#008000" color="#008000" size={20} />
				<Star fill="#008000" color="#008000" size={20} />
			</div>

			<div className="text-[#3866DF] underline font-semibold space-x-[4px] text-[14px] cursor-pointer">
				<span>18521 Ratings</span>
			</div>
		</div>
	) : (
		<a href="#porduct_reviews" className="flex items-center justify-center w-fit space-x-2  bg-[#f3f4f8] py-[4px] px-[6px] rounded-[6px]">
			<div className="flex items-center space-x-1">
				<Star fill="#008000" color="#008000" size={14} />
				<div className="font-semibold text-[14px]">4.6</div>
			</div>
			<div className="text-[#9ba0b1] text-[14px]">
				<span>(20.6K)</span>
			</div>
		</a>
	);
}
