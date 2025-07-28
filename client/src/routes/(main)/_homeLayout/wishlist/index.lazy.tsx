import { WishlistPage } from "@/components/wishlist-page";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/wishlist/")({
	component: WishlistPage,
});