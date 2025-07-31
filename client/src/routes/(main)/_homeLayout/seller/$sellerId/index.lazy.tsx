import { SellerPage } from "@/pages/seller";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/seller/$sellerId/")({
	component: SellerPage,
});
