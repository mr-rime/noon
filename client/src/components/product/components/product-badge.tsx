import { Image } from "@unpic/react";

export function ProductBadge() {
	return (
		<div className="h-[18px] mt-2 select-none" aria-label="badge" role="img">
			<Image
				src="/media/svgs/marketplace-v2-en.svg"
				alt="badge"
				className="w-auto h-full"
				draggable={false}
				width={46}
				height={18}
				layout="constrained"
			/>
		</div>
	);
}
