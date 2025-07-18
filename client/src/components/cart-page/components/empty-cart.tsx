import { Image } from "@unpic/react";

export function EmptyCart() {
	return (
		<div>
			<Image src="/media/imgs/cart-empty.avif" alt="empty-cart" width={400} height={400} layout="constrained" />
		</div>
	);
}
