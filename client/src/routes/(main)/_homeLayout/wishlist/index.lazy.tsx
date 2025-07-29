import { WishlistPage } from "@/pages/wishlist";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/wishlist/")({
	component: WishlistPage,
});