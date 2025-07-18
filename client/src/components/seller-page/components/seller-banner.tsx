import { Image } from "@unpic/react";

export function SellerBanner() {
	return (
		<div className="h-[200px] w-full">
			<Image
				src="/media/imgs/noon-banner.png"
				alt="banner"
				className="w-full h-full"
				width={1200}
				height={200}
				layout="constrained"
			/>
		</div>
	);
}
