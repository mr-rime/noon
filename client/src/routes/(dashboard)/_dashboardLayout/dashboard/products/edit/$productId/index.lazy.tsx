import { EditProduct } from "@/pages/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/edit/$productId/")({
	component: EditProduct,
});
