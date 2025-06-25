import { Star } from "lucide-react";
import { seller_page_icons } from "../constants/icons";

export function SellerReview() {
	return (
		<div className="border-b border-[#f3f4f8] py-[24px] break-words w-full">
			<div className="flex items-start gap-[4px_8px] mb-[8px] ">
				<div className="w-[34px] h-[34px] text-[#9ba0b1] bg-[#eff3fd] rounded-full flex items-center justify-center font-bold text-[14px]">
					A
				</div>
				<div className="flex items-start justify-between space-x-[20px]">
					<div className="flex flex-col items-start">
						<div className="text-[14px]">Ahmed H.</div>
						<div className="text-[#9ba0b1] text-[12px]">Jun 17, 2025</div>
					</div>
					<div className="bg-[#f3f4f8] rounded-full text-[12px] h-[20px] min-w-[120px] px-[5px] flex items-center spcae-x-[5px]">
						{seller_page_icons.virifiedIcon}
						<div className="ml-1.5">Verified Purchase</div>
					</div>
				</div>
			</div>
			<div className="my-1 flex items-center gap-1">
				<Star fill="#008000" color="#008000" size={16} />
				<Star fill="#008000" color="#008000" size={16} />
				<Star fill="#008000" color="#008000" size={16} />
				<Star fill="#DBDDE3" color="#DBDDE3" size={16} />
				<Star fill="#DBDDE3" color="#DBDDE3" size={16} />
			</div>
			<div className="break-words w-full h-[2.5em] block pr-[45px] text-[14px] mt-3 font-cairo">Expired product</div>

			<div className="flex items-center space-x-1">
				{seller_page_icons.reportIcon}
				<button className="text-[14px] text-[#7e859b] font-bold cursor-pointer hover:opacity-[.8]">Report</button>
			</div>
		</div>
	);
}
