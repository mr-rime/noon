import { Image } from "@unpic/react";

export function StoreAvatar() {
	return (
		<div className="flex items-center space-x-3">
			<div className="h-[64px] rounded-full overflow-hidden">
				<Image
					src="/media/imgs/logo-eg.png"
					alt="store-logo"
					className="w-full h-full rounded-full"
					width={64}
					height={64}
					layout="constrained"
				/>
			</div>
			<div className="text-[18px]">
				<strong>Rime Store</strong>
			</div>
		</div>
	);
}
