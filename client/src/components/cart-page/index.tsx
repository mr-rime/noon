import { useQuery } from "@apollo/client";
import { CartItems } from "./components/cart-items";
import { OrderSummary } from "./components/order-summary";
import type { CartItem, CartResponseType } from "./types";
import { GET_CART_ITEMS } from "@/graphql/cart";
import { useEffect } from "react";
import { CartLoadingSkeleton } from "./components/cart-loading-skeleton";

export function CartPage() {
	const { data, refetch, loading } = useQuery<CartResponseType>(GET_CART_ITEMS);

	useEffect(() => {
		refetch();
	}, []);

	if (loading) return <CartLoadingSkeleton />;

	return (
		<main className="w-full h-full site-container py-2 mt-10 px-[45px]">
			<h1 className="flex items-center space-x-1">
				<strong className="text-[23px]">Cart</strong>
				<div className="text-[#7e859b] text-[14px]">({data?.getCartItems.cartItems.length} items)</div>
			</h1>
			{/* <section className="w-full flex items-center justify-center mt-10">
                <Link to="/">
                    <EmptyCart />
                </Link>
            </section>
             */}
			<section className="flex items-start w-full space-x-7">
				<CartItems cartItems={data?.getCartItems.cartItems as CartItem[]} refetch={refetch} />
				<OrderSummary />
			</section>
		</main>
	);
}
