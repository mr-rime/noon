import { CartPage } from "@/features/cart";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/cart/")({
	component: CartPage,
});
