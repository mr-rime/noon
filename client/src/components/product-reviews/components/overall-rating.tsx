import { Star } from "lucide-react";
import { Progress } from "../../ui/progress";

export function OverallRating() {
	return (
		<section className="min-w-[456px] max-w-[32%]">
			<div className="text-[19px] font-bold mb-2">Overall Rating</div>

			<div className="text-[32px] font-bold">
				<span>4.2</span>
			</div>
			<div className="my-1 flex items-center gap-1">
				<Star fill="#80AE04" color="#80AE04" size={25} />
				<Star fill="#80AE04" color="#80AE04" size={25} />
				<Star fill="#80AE04" color="#80AE04" size={25} />
				<Star fill="#80AE04" color="#80AE04" size={25} />
				<Star fill="#80AE04" color="#80AE04" size={25} />
			</div>
			<div className="text-[#7e859b]">
				<span>Based on 22 ratings</span>
			</div>
			<div className="w-full mb-5 mt-3 ">
				<div className="flex items-center space-x-1 w-full">
					<div className="flex items-center">
						<div className="text-[14px] w-[8px] font-bold mr-1">
							<span>5</span>
						</div>
						<Star fill="#008000" color="#008000" size={15} />
					</div>
					<Progress progressPercentage={200} />
					<div className="text-[14px] font-bold ml-1">
						<span>77%</span>
					</div>
				</div>

				<div className="flex items-center space-x-1 w-full mt-2">
					<div className="flex items-center">
						<div className="text-[14px] w-[8px] font-bold mr-1">
							<span>4</span>
						</div>
						<Star fill="#80AE04" color="#80AE04" size={15} />
					</div>
					<Progress progressPercentage={30} progressColor="#82ae04" />
					<div className="text-[14px] font-bold ml-1">
						<span>5%</span>
					</div>
				</div>

				<div className="flex items-center space-x-1 w-full mt-2">
					<div className="flex items-center">
						<div className="text-[14px] w-[8px] font-bold mr-1">
							<span>3</span>
						</div>
						<Star fill="#F2AA31" color="#F2AA31" size={15} />
					</div>
					<Progress progressPercentage={30} progressColor="#F3AC30" />
					<div className="text-[14px] font-bold ml-1">
						<span>5%</span>
					</div>
				</div>

				<div className="flex items-center space-x-1 w-full mt-2">
					<div className="flex items-center">
						<div className="text-[14px] w-[8px] font-bold mr-1">
							<span>2</span>
						</div>
						<Star fill="#F36C31" color="#F36C31" size={15} />
					</div>
					<Progress progressPercentage={0} progressColor="#F36C32" />
					<div className="text-[14px] font-bold ml-1">
						<span>0%</span>
					</div>
				</div>

				<div className="flex items-center space-x-1 w-full mt-2">
					<div className="flex items-center">
						<div className="text-[14px] w-[8px] font-bold mr-1">
							<span>1</span>
						</div>
						<Star fill="#F36C31" color="#F36C31" size={15} />
					</div>
					<Progress progressPercentage={70} progressColor="#F36C32" />
					<div className="text-[14px] font-bold ml-1">
						<span>14%</span>
					</div>
				</div>
			</div>
		</section>
	);
}
