import { useQuery } from "@apollo/client";
import { CartItem } from "./cart-item";
import { GET_CART_ITEMS } from "@/graphql/cart";

export function CartItems() {
	const { data } = useQuery(GET_CART_ITEMS);
	console.log(data);
	return (
		<section className="mt-10 w-full max-w-[65%] flex flex-col items-center gap-3">
			<CartItem />
		</section>
	);
}
