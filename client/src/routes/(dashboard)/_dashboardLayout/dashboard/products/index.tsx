import { createFileRoute } from "@tanstack/react-router";
import { ProductsSection } from "../../../../../components/dashboard/components/products-section";

type ProductsSearch = {
	q: string;
};

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard/products/")({
	component: ProductsSection,
	validateSearch: (search: Record<string, ProductsSearch["q"]>): ProductsSearch => {
		return {
			q: search?.q,
		};
	},
});
