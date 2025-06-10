import { CartOrder } from "./cart-order";

export function CartOrders() {
    return (
        <section className="mt-10 w-full max-w-[65%] flex flex-col items-center gap-3">
            <CartOrder />
            <CartOrder />
        </section>
    )
}
