import { Image } from "@unpic/react";

export function ProductPageFulfilmentBadge() {
	return (
		<div className="flex items-center space-x-5 mt-3">
			<div>
				<Image
					src="/media/svgs/marketplace-v2-en.svg"
					alt="marketplace-v2-en"
					width={46}
					height={18}
					layout="constrained"
				/>
			</div>

			<div className="font-bold text-[14px]">
				Get it by <b>14 June</b>
			</div>
		</div>
	);
}
