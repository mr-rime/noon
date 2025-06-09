import { Link } from "@tanstack/react-router";
import { EmptyCart } from "./components/empty-cart";

export function CartPage() {
    return (
        <main className="w-full">
            <section className="w-full flex items-center justify-center mt-10">
                <Link to="/">
                    <EmptyCart />
                </Link>
            </section>
        </main>
    )
}
