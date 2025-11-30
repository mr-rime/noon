import { SellerPage } from "@/features/seller/components/seller";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/seller/$sellerId/")({
	component: SellerPage,
});
