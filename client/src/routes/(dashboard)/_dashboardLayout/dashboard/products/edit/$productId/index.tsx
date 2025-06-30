import { EditProduct } from "@/components/dashboard/components/products-section/components/edit-product";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/edit/$productId/")({
	component: EditProduct,
});
