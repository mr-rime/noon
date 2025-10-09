import { createLazyFileRoute } from "@tanstack/react-router";
import { ProductDetailsPage } from "@/pages/dashboard/components/products/product-details-page";

function ProductEditPage() {
	return <ProductDetailsPage />
}

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/products/edit/$productId/")({
	component: ProductEditPage,
});
