import { createLazyFileRoute } from "@tanstack/react-router";
import { ProductDetailsPage } from "@/pages/dashboard/components/products/product-details-page";

function ProductDetailsPageRoute() {
  return <ProductDetailsPage />
}

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/products/$productId/")({
  component: ProductDetailsPageRoute,
});