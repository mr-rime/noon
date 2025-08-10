import { ProductsSection } from "@/pages/dashboard";
import { createFileRoute } from "@tanstack/react-router";

type ProductsSearch = {
	q?: string;
};

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/")({
	component: ProductsSection,
	validateSearch: (search: Record<string, ProductsSearch["q"]>): ProductsSearch => {
		return {
			q: search?.q,
		};
	},
});
