import { CartOrders } from "./components/cart-orders";
import { OrderSummary } from "./components/order-summary";

export function CartPage() {
	return (
		<main className="w-full h-full site-container py-2 mt-10 px-[45px]">
			<h1 className="flex items-center space-x-1">
				<strong className="text-[23px]">Cart</strong>
				<div className="text-[#7e859b] text-[14px]">(2 items)</div>
			</h1>
			{/* <section className="w-full flex items-center justify-center mt-10">
                <Link to="/">
                    <EmptyCart />
                </Link>
            </section>
             */}
			<section className="flex items-start w-full space-x-7">
				<CartOrders />
				<OrderSummary />
			</section>
		</main>
	);
}
