import { Star } from "lucide-react";
import { Progress } from "../progress";

export function RatingsBar() {
	return (
		<div className="w-full ">
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
	);
}
