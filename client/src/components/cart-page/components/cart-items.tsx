import { CartItem } from "./cart-item";
import type { CartItem as CartItemType } from "../types";

export function CartItems({ cartItems, refetch }: { cartItems: CartItemType[]; refetch: () => Promise<any> }) {
	return (
		<section className="mt-10 w-full max-w-[65%] flex flex-col items-center gap-3">
			{cartItems.map((item) => (
				<CartItem key={item.product_id} {...item} refetchCartItems={refetch} />
			))}
		</section>
	);
}
