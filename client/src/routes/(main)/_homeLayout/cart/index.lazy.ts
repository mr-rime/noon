import { CartPage } from "@/pages/cart";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/cart/")({
	component: CartPage,
});
