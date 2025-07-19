import { EditProduct } from "@/components/dashboard/components/products-section/components/edit-product";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/edit/$productId/")({
	component: EditProduct,
});
