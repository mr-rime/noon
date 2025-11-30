import { ProductPage } from "@/features/product";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(main)/_homeLayout/$title/$productId/")({
	component: ProductPage,
});
