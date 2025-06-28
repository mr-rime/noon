import { useState } from "react";
import { reviews_icons } from "../constants/icons";
import { cn } from "@/utils/cn";
import { Check, Star } from "lucide-react";

export function ProductReview() {
	const [helpful, setHelpful] = useState(false);
	return (
		<div className="border-b border-[#f3f4f8] py-[24px] break-words">
			<div className="flex items-start flex-row gap-y-[4px] gap-x-[8px] mb-[8px]">
				<div className="flex items-center justify-center uppercase w-[34px] h-[34px] text-[#9ba0b1] font-bold bg-[#eff3fd] rounded-full">
					M
				</div>
				<div className="flex flex-col gap-[2px] w-full">
					<div className="flex items-center justify-between w-full">
						<div>
							<div>Ahmed H.</div>
							<div className="text-[#9ba0b1] text-[12px]">Nov 26, 2024</div>
						</div>
						<div className="flex items-center px-[5px] gap-[4px] rounded-full bg-[#f3f4f8] text-[12px] h-[20px] ">
							{reviews_icons.verifiedIcon}
							<span>Verified Purchase</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-[3px] mt-1 mb-3">
				<Star color="#008000" fill="#008000" size={16} />
				<Star color="#008000" fill="#008000" size={16} />
				<Star color="#008000" fill="#008000" size={16} />
				<Star color="#008000" fill="#008000" size={16} />
				<Star color="#008000" fill="#008000" size={16} />
			</div>

			<div className="text-[16px] w-full font-bold break-words">
				Fantastic Deal on iPhone 16 Pro Max: Fast Delivery, Great Price, and Top-Notch Quality!
			</div>
			<div className="w-full text-[16px] break-words leading-[1.5em] pr-[45px] mt-1">
				I recently purchased the iPhone 16 Pro Max, and I couldn't be more pleased with my experience. I got it at an amazing discounted price, which made the deal even sweeter. The delivery was super fast, and everything arrived in perfect condition, right on time. The product itself is original and feels premium as expected from Apple, with all the latest features and a stunning display. Overall, I'm really satisfied with my purchase—great value for money, excellent service, and a top-quality device. Highly recommend!
			</div>

			<div className="flex items-center gap-[4px] mt-3">
				<button onClick={() => setHelpful(prev => !prev)} className={cn("border cursor-pointer py-[2px] px-[5px]  rounded-[4px] flex items-center gap-[4px] ", !helpful ? "border-[#7e859b] text-[#7e859b]" : "border-[#3866df] text-[#3866df]")}>
					{reviews_icons.helpfulIcon}

					<span className="text-[14px]">{!helpful ? "Helpful" : ""} (30)</span>
				</button>

				{
					helpful && <div className="flex items-center gap-[3px] ml-2">
						<Check color="#50B823" size={18} /> <span>Thanks for voting!</span>
					</div>
				}
			</div>
		</div>
	);
}
