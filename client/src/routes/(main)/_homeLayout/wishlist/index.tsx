import { WishlistPage } from "@/features/wishlist";
import { createFileRoute } from "@tanstack/react-router";

type WishlistSearch = {
	wishlistCode?: string
}

export const Route = createFileRoute("/(main)/_homeLayout/wishlist/")({
	component: WishlistPage,
	validateSearch: (search: Record<string, WishlistSearch["wishlistCode"]>): WishlistSearch => {
		return {
			wishlistCode: search?.wishlistCode,
		};
	},
});