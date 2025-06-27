export function ProductOverviewTabs() {
	return (
		<div className="w-full  shadow-[0_8px_16px_-12px_rgba(0,0,0,.15)] p-[18px_32px]">
			<div className="flex max-md:flex-col w-full max-md:gap-3 items-center max-md:text-center md:space-x-4 site-container">
				<a href="#porduct_overview" className="p-[8px_16px] max-md:w-full text-[16px] border border-[#cfcfcf] rounded-full">
					Product Overview
				</a>
				<a href="#porduct_reviews" className="p-[8px_16px]  max-md:w-full max-md:text-center text-[16px] border border-[#cfcfcf] rounded-full">
					Product Ratings & Reviews
				</a>
			</div>
		</div>
	);
}
