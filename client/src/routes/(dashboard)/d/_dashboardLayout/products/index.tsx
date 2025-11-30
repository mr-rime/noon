import Products from "@/features/dashboard/components/pages/products";
import { createFileRoute } from "@tanstack/react-router";

type ProductsSearch = {
	q?: string;
};

export const Route = createFileRoute("/(dashboard)/d/_dashboardLayout/products/")({
	component: Products,
	validateSearch: (search: Record<string, ProductsSearch["q"]>): ProductsSearch => {
		return {
			q: search?.q,
		};
	},
});
