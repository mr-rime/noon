import { NewProduct } from "@/pages/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/new/")({
	component: NewProduct,
});
