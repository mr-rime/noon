import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/products/edit/$productId/")({
	component: () => null,
});
