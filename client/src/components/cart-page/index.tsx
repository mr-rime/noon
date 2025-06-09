import { Link } from "@tanstack/react-router";
import { EmptyCart } from "./components/empty-cart";
import { CartItems } from "./components/cart-items";

export function CartPage() {
    return (
        <main className="w-full h-full site-container p-2 mt-10">
            <h1 className="flex items-center space-x-1">
                <strong className="text-[23px]">Cart</strong>
                <div className="text-[#7e859b] text-[14px]">
                    (2 items)
                </div>
            </h1>
            {/* <section className="w-full flex items-center justify-center mt-10">
                <Link to="/">
                    <EmptyCart />
                </Link>
            </section>
             */}

            <CartItems />
        </main>
    )
}
