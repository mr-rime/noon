import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/d/products/edit/$productId/")({
	component: () => null,
});
