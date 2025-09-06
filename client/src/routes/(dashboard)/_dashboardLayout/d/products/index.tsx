import { createFileRoute } from "@tanstack/react-router";

type ProductsSearch = {
	q?: string;
};

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/d/products/")({
	component: () => null,
	validateSearch: (search: Record<string, ProductsSearch["q"]>): ProductsSearch => {
		return {
			q: search?.q,
		};
	},
});
