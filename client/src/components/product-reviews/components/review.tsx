import { reviews_icons } from "../constants/icons";

export function ProductReview() {
	return (
		<div className="border-b border-[#f3f4f8] py-[24px] break-words">
			<div className="flex items-start flex-row gap-y-[4px] gap-x-[8px] mb-[8px]">
				<div className="flex items-center justify-center uppercase w-[34px] h-[34px] text-[#9ba0b1] font-bold bg-[#eff3fd] rounded-full">
					M
				</div>
				<div className="flex flex-col gap-[2px] w-full">
					<div className="flex items-center justify-between w-full">
						<div>Ahmed H.</div>
						<div className="flex items-center px-[5px] gap-[4px] rounded-full bg-[#f3f4f8] text-[12px] h-[20px] ">
							{reviews_icons.verifiedIcon}
							<span>Verified Purchase</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
