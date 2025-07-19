import { createLazyFileRoute } from "@tanstack/react-router";
import { NewProduct } from "@/components/dashboard/components/products-section/components/new-product";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/new/")({
	component: NewProduct,
});
