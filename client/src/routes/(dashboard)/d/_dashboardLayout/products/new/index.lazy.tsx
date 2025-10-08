import { createLazyFileRoute } from "@tanstack/react-router";
import { ProductCreationWizard } from "@/pages/dashboard/components/products/product-creation-wizard";

function NewProductPage() {
	return <ProductCreationWizard onClose={() => window.history.back()} />
}

export const Route = createLazyFileRoute("/(dashboard)/d/_dashboardLayout/products/new/")({
	component: NewProductPage,
});
